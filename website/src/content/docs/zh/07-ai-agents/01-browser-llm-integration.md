---
title: '在浏览器中集成大模型与流式响应'
description: '构建打字机效果、真正解析 Server-Sent Events (SSE)、处理网络可中断控制，以及 fetch 与原生 EventSource 的取舍'
---

在 AI 时代，前端工程师的角色正经历深刻重塑：**我们不再仅仅是构建静态交互的"切图仔"，而是将大语言模型（LLM）的推理能力与用户体验无缝缝合的"智能界面架构师"**。

在传统 Web API 中，客户端发送一个请求并等待完整的 JSON 返回；而大语言模型生成 Token 需要数秒甚至数十秒，如果让用户面对空白屏幕死等，体验是灾难性的。**流式传输（Streaming）是现代 AI 应用的生命线。**

---

## 1. 为什么必须使用流式传输？

- **首字耗时 (Time to First Token / TTFT)**：流式响应的意义是用户不必等模型生成完整结果就能看到第一个字。典型 TTFT 从几百毫秒到几秒不等，**取决于排队深度、预填充耗时、模型规模与网络延迟**——并不存在统一 SLA。
- **打字机视觉动效**：Token 随着大模型自回归生成逐字跃然屏上，呈现自然的思考流动感。

> 💡 浏览器消费流的两条路径：**`fetch` + `ReadableStream`**（完全可控，需自行解析）和原生 **`EventSource`**（仅 GET，浏览器代为解析）。下文都会讲到。

---

## 2. fetch + ReadableStream：完全可控，但需要自己解析

`fetch` 返回的是 `ReadableStream<Uint8Array>`——原始字节流。要把它变成 SSE 事件，你需要自己解析：`fetch` 不会剥 `data:` 前缀、不会合并多行 `data:`、也不会按事件间的空行做切分。

### 2.1 一个真正的 SSE 解析器

```typescript
// streaming-client.ts - 浏览器端真正的 SSE 消费
export type SSEEvent = {
  event: string;
  data: string;
  id: string | null;
  retry: number | null;
};

// 从任意字节缓冲里切出已完成的 SSE 事件，返回残留 partial 给下一轮
export function parseSSEBuffer(buffer: string, onEvent: (e: SSEEvent) => void): string {
  // SSE 规范：事件之间用一个空行 (\n\n) 分隔；
  // 单个事件可以包含多个 "data:" 行，用 \n 连接；
  // ":" 开头的行是注释；未识别字段忽略。
  let remaining = buffer;
  let idx: number;
  while ((idx = remaining.indexOf('\n\n')) !== -1) {
    const raw = remaining.slice(0, idx);
    remaining = remaining.slice(idx + 2);

    const lines = raw.split('\n');
    const event: SSEEvent = { event: 'message', data: '', id: null, retry: null };
    const dataLines: string[] = [];

    for (const line of lines) {
      if (line.startsWith(':')) continue;                        // SSE 注释
      const colon = line.indexOf(':');
      const field = colon === -1 ? line : line.slice(0, colon);
      const value = colon === -1 ? '' : line.slice(colon + 1).replace(/^ /, '');
      if (field === 'data') dataLines.push(value);
      else if (field === 'event') event.event = value;
      else if (field === 'id') event.id = value;
      else if (field === 'retry') event.retry = Number(value);
    }
    event.data = dataLines.join('\n');
    onEvent(event);
  }
  return remaining;
}

export async function streamChatCompletion(
  prompt: string,
  onChunk: (text: string) => void,
  signal?: AbortSignal
): Promise<void> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
    signal,
  });

  if (!response.ok || !response.body) {
    throw new Error(`API Request failed: ${response.statusText}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';                       // 跨 chunk 保留 partial 事件
  let done = false;

  while (!done) {
    const { value, done: readerDone } = await reader.read();
    done = readerDone;
    if (!value) continue;
    buffer += decoder.decode(value, { stream: true });
    buffer = parseSSEBuffer(buffer, (e) => {
      if (e.event === 'done') { done = true; return; }
      // 数据体可能是 JSON 编码的增量，按需适配
      try { onChunk((JSON.parse(e.data) as { text: string }).text); }
      catch { onChunk(e.data); }
    });
  }
  // 冲刷解码器，处理跨 chunk 切开的 UTF-8 多字节字符
  buffer += decoder.decode();
  if (buffer.trim()) buffer = parseSSEBuffer(buffer + '\n\n', onEvent);
}
```

三个值得注意的点：

- `reader.read()` 返回的是**字节**，不是事件——一个 chunk 可能是一个事件的片段、若干个事件、或者把一个 UTF-8 多字节字符切开。
- 所以解析器**必须跨 chunk 保持状态**：把残留的 partial 事件返回，下一轮前置拼接。
- `TextDecoder` 只处理 UTF-8 边界，**不处理 SSE 边界**。

如果你的服务端已经把协议剥掉、直接吐纯文本 chunk，那把解析器换成一行 `decoder.decode(value, { stream: true })` 即可——但本节标题得改成 "用 fetch 消费文本流"。

---

## 3. 原生 EventSource：仅 GET，浏览器替你解析

当服务端能提供一个 `GET /api/events`、返回 `text/event-stream` 的端点时，浏览器帮你做解析。

```typescript
const source = new EventSource('/api/events');

// 默认事件 "message"：
source.onmessage = (event) => {
  // event.data 已经是解析好的 SSE payload（没有 `data:` 前缀）
  console.log(event.data);
};

// 服务端约定的自定义事件：
source.addEventListener('done', () => {
  source.close();   // 干净退出
});

source.onerror = () => {
  // ⚠️ 不要在这里无条件 source.close() —— EventSource 内置指数退避重连，
  // 每次都关闭会与重连机制对抗，是常见踩坑点。
  console.error('连接异常，当前状态:', source.readyState);
  // 只有 source.readyState === EventSource.CLOSED (2) 时才彻底 close
};
```

### 3.1 何时用哪个

| 能力 | 浏览器原生 `EventSource` | `fetch` + `ReadableStream` |
| --- | --- | --- |
| 请求方法 | 仅 GET | 任意（POST/PUT/…） |
| 自定义请求头 / 请求体 | 不支持 | 完全可控 |
| 鉴权（Bearer / Cookie） | 仅 cookie（`withCredentials`） | 任意 Header |
| SSE 解析 | 浏览器自动完成 | 需要自己解析 |
| 断线重连 | 内置（支持 `retry: ms`） | 需手动实现 |
| 主动停止 | `source.close()` | `controller.abort()` |

**选 `EventSource`**：单向服务器→客户端推送（日志、通知、进度）且不需要鉴权头。

**选 `fetch`**：需要 POST body、自定义鉴权头、或者把用户输入随请求一起发——这恰好是 chat completion 的场景。

---

## 4. 在 React 中构建打字机流式组件

结合 React 的响应式状态，我们可以轻松封装出丝滑的打字机交互：

```tsx
import { useState, useRef } from 'react';
import { streamChatCompletion } from './streaming-client';

export function AIChatBox() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;

    setResponse('');
    setIsGenerating(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      await streamChatCompletion(
        input,
        (chunk) => { setResponse((prev) => prev + chunk); },
        controller.signal
      );
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('用户主动中断生成');
      } else {
        console.error('生成失败:', err);
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  const handleStop = () => {
    abortControllerRef.current?.abort(); // 中断浏览器侧的 HTTP 流
  };

  return (
    <div className="chat-container">
      <div className="output-area">{response || '等待提问...'}</div>
      <div className="controls">
        <input value={input} onChange={(e) => setInput(e.target.value)} />
        {isGenerating ? (
          <button onClick={handleStop} className="btn-danger">停止生成</button>
        ) : (
          <button onClick={handleSend} className="btn-primary">发送</button>
        )}
      </div>
    </div>
  );
}
```

---

## 5. 关键架构考量

1. **防抖节流渲染**：当高并发模型每秒喷涌上百个 Token 时，每次 `setResponse` 触发组件全量 Diff 会造成浏览器卡顿。在生产环境中，应使用 `requestAnimationFrame` 合并高频 chunk 再统一刷新。
2. **Markdown 增量解析**：使用支持流式 AST 的 Markdown 解析器（如 Remark/Rehype 流式插件），避免代码块语法高亮在流式闭合前发生剧烈闪烁。
3. **中断语义**：`controller.abort()` 取消的是浏览器侧的 HTTP 流，但**上游模型可能仍在生成与计费**，除非服务端把 `req.signal` 透传到模型 SDK（例如 Anthropic SDK 的 `client.messages.stream({ …, signal })`）。计费规则因厂商而异，请查阅对应文档。
4. **持久化与续传**：`fetch` 和 `EventSource` 都不会在网络抖动后自动从上一个字节续传。对长链路场景，应让服务端做幂等或暴露可续传的 ID（SSE 的 `id:` 字段正好为此而生）。