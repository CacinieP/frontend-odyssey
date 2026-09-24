---
title: '在浏览器中集成大模型与流式响应'
description: '构建打字机效果、处理 Server-Sent Events (SSE) 与网络可中断控制'
---

在 AI 时代，前端工程师的角色正经历深刻重塑：**我们不再仅仅是构建静态交互的“切图仔”，而是将大语言模型（LLM）的推理能力与用户体验无缝缝合的“智能界面架构师”**。

在传统 Web API 中，客户端发送一个请求并等待完整的 JSON 返回；而大语言模型生成 Token 需要数秒甚至数十秒，如果让用户面对空白屏幕死等，体验是灾难性的。**流式传输（Streaming）是现代 AI 应用的生命线。**

---

## 1. 为什么必须使用流式传输？

- **首字耗时 (Time to First Token / TTFT)**：通过流式响应，用户在 200~500ms 内就能看到首个字输出，极大地缓解等待焦虑。
- **打字机视觉动效**：Token 随着大模型自回归生成逐字跃然屏上，呈现自然的思考流动感。

---

## 2. 浏览器端解析 Server-Sent Events (SSE)

大模型 API 通常基于 HTTP 流式规范返回 `text/event-stream`。在前端，现代浏览器通过标准的 `fetch` 与 `ReadableStream` 即可原生消费流式数据，无需引入庞大第三方库：

```typescript
// streaming-client.ts - 浏览器端消费流式 Token
export async function streamChatCompletion(
  prompt: string,
  onChunk: (text: string) => void,
  signal?: AbortSignal
): Promise<void> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
    signal, // 支持用户随时点击“停止生成”中断请求
  });

  if (!response.ok || !response.body) {
    throw new Error(`API Request failed: ${response.statusText}`);
  }

  // 1. 获取浏览器原生 UTF-8 流解码器
  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let done = false;

  // 2. 异步迭代消费每一个分块 (Chunk)
  while (!done) {
    const { value, done: readerDone } = await reader.read();
    done = readerDone;
    if (value) {
      const chunkText = decoder.decode(value, { stream: true });
      onChunk(chunkText); // 实时触发 UI 重绘
    }
  }
}
```

---

## 3. 在 React 中构建打字机流式组件

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

    // 创建新的中断控制器
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      await streamChatCompletion(
        input,
        (chunk) => {
          setResponse((prev) => prev + chunk); // 流式追加文本
        },
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
    abortControllerRef.current?.abort(); // 中断网络请求，停止扣费与渲染
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

## 4. 关键架构考量

1. **防抖节流渲染**：当高并发模型每秒喷涌上百个 Token 时，每次 `setResponse` 触发组件全量 Diff 会造成浏览器卡顿。在生产环境中，应使用 `requestAnimationFrame` 合并高频 chunk 再统一刷新。
2. **Markdown 增量解析**：使用支持流式 AST 的 Markdown 解析器（如 Remark/Rehype 流式插件），避免代码块语法高亮在流式闭合前发生剧烈闪烁。
