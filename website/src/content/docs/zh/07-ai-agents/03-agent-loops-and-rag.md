---
title: '自主智能体循环与浏览器端 RAG'
description: '探索 ReAct 范式、工具自治闭环与轻量级客户端检索增强生成'
---

如果说工具调用（Tool Calling）让模型拥有了双手，那么**自主智能体（Autonomous Agents）则让模型拥有了“自主思考、规划与纠错”的灵魂**。

在复杂任务场景中（例如：“*分析当前代码库中的所有组件，找出未引用的 Dead Code 并生成重构 PR*”），单次 LLM 请求无论上下文多大都无法直接完成。智能体需要自主分解目标，在**思考 (Thought) ➔ 行动 (Action) ➔ 观察 (Observation)** 的持续循环中逐步逼近最终结果。

---

## 1. 经典 ReAct 范式与智能体运行循环 (Agent Loop)

ReAct（Reasoning + Acting）是业界最广泛采用的智能体执行范式：

```text
               ┌───────────────────────────────┐
               ▼                               │
[接收用户目标] ──► [思考 (Thought)]               │
                        │                       │
                        ▼                       │ (循环自治迭代)
                   [行动 (Action)] ──► 执行工具调用 │
                        │                       │
                        ▼                       │
                   [观察 (Observation)] ────────┘
                        │
                        ▼ (当判定目标达成时退出)
                   [交付最终结果给用户]
```

### TypeScript 核心智能体循环实现

```typescript
// agent-loop.ts - 智能体自主运行时核心骨架
interface Tool {
  name: string;
  execute: (args: Record<string, any>) => Promise<string>;
}

export async function runAgentLoop(
  userGoal: string,
  tools: Map<string, Tool>,
  callLLM: (history: any[]) => Promise<any>,
  maxIterations = 10
): Promise<string> {
  const history: any[] = [{ role: 'user', content: userGoal }];

  for (let step = 0; step < maxIterations; step++) {
    // 1. 让模型基于当前全量历史进行推理与行动决策
    const response = await callLLM(history);
    history.push(response);

    // 2. 如果模型未请求调用任何工具，说明任务已完成
    if (!response.tool_calls || response.tool_calls.length === 0) {
      return response.content;
    }

    // 3. 逐一执行模型请求的工具，并将环境反馈（Observation）存入历史
    for (const toolCall of response.tool_calls) {
      const tool = tools.get(toolCall.function.name);
      const args = JSON.parse(toolCall.function.arguments);
      
      const observation = tool 
        ? await tool.execute(args)
        : `Error: Tool ${toolCall.function.name} not found`;

      history.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        content: observation,
      });
    }
  }

  throw new Error('Agent reached maximum iteration limit without resolving goal.');
}
```

---

## 2. 浏览器端检索增强生成 (Client-Side RAG)

大模型存在**上下文窗口大小限制**与**幻觉 (Hallucination)** 风险。面对几十万字的私有开发文档或用户个人笔记，将所有内容全部塞进 Prompt 既昂贵又极其缓慢。

**检索增强生成 (Retrieval-Augmented Generation / RAG)** 的核心思路是：在向模型提问前，先通过语义向量相似度（Vector Search）将最相关的几段文本精准检索出来，作为参考资料喂给模型：

```text
[本地海量文档] ──► 文本切块 (Chunking) ──► 向量化 (Embedding) ──► 存入向量索引 (OPFS/IndexedDB)
                                                                            │
[用户问题 "如何配置 pnpm?"] ──► 计算问题向量 ──► 余弦相似度搜索 (Cosine Similarity) ──┘
                                      │
                                      ▼ 检索出 Top 3 关联段落
[组装 Prompt] ──► "根据以下参考资料回答问题：\n[段落1]...\n[段落2]..." ──► 提交给 LLM
```

利用基于 WebAssembly 的轻量级本地向量引擎（如 Voy、Transformers.js），前端开发者可以在**完全不依赖后端服务器、保护用户本地隐私**的前提下，在浏览器中离线运行高精度的 RAG 智能助手！

---

## 3. 前端工程师的下一个十年

从 HTML/CSS 的文档展示，到 React 的富应用交互，再到融入 MCP 与自主 Agent 的全智能界面：**代码的载体在变，但解决人类与信息交互摩擦的核心使命从未改变**。

保持好奇，持续动手，祝你在前端奥德赛（Frontend Odyssey）的浩瀚征途中尽情探索！🌟
