---
title: '工具调用 (Function Calling) 与模型上下文协议 (MCP)'
description: '赋予大模型感知环境与执行操作的“手和眼”'
---

单纯的聊天机器人只能根据预训练权重里的死知识“纸上谈兵”。如果用户询问：“*我明天的第一场会议是什么时候？*”或者要求：“*请帮我将这个订单退款*”，大模型自身既无法连接你的日历数据库，也无法发起真实的业务操作。

**工具调用 (Tool / Function Calling) 彻底打破了这一桎梏。它赋予了大语言模型与真实世界交互的“双手与眼睛”。**

---

## 1. 工具调用的双向往返机制 (Roundtrip)

初学者常犯的误区：*大模型会直接在它的服务器上执行我写的代码吗？*

**不会！** 大模型本身永远只是一个文本预测器。真正的执行过程遵循严格的**双向闭环机制**：

```text
[用户提问] "上海今天天气如何？"
    │
    ▼
[前端请求] 将问题 + 工具列表 (JSON Schema) 发送给 LLM
    │
    ▼
[LLM 思考] 判断需要调用天气工具，返回一个特殊的结构化指令：
           { "name": "get_weather", "arguments": { "city": "Shanghai" } }
    │
    ▼
[前端/服务端] 拦截到函数调用意图，真实调用本地天气 API 获取数据：
              { "temp": "24°C", "condition": "Sunny" }
    │
    ▼
[二次请求] 将工具执行结果作为 Observation 再次喂给 LLM
    │
    ▼
[最终输出] "上海今天晴，气温 24°C，非常适宜出行！"
```

---

## 2. 定义工具与 JSON Schema 规范

在发送请求给大模型时，工具的参数通过标准的 JSON Schema 进行严格声明：

```typescript
// tools.ts - 声明工具元信息
export const weatherTool = {
  type: 'function',
  function: {
    name: 'get_current_weather',
    description: '获取指定城市的实时天气数据',
    parameters: {
      type: 'object',
      properties: {
        city: {
          type: 'string',
          description: '城市名称，如 Beijing, Shanghai',
        },
        unit: {
          type: 'string',
          enum: ['celsius', 'fahrenheit'],
          description: '温度单位，默认为摄氏度',
        },
      },
      required: ['city'],
    },
  },
};
```

---

## 3. 什么是模型上下文协议 (MCP, Model Context Protocol)？

虽然传统 Function Calling 解决了单体工具连接问题，但随着工具数量激增，每个系统都各自为政定义一套专有规范，生态极度碎片化。

由 Anthropic 发起、如今各大智能体平台全面支持的 **Model Context Protocol (MCP)** 正是 AI 时代的“USB 标准接口”：

```text
       ┌───────────────┐
       │   AI Client   │ (如 Antigravity, Claude Desktop)
       └───────┬───────┘
               │ 标准 MCP 协议 (JSON-RPC over stdio / SSE)
       ┌───────┴───────┐
       │   MCP Host    │
       └───┬───────┬───┘
           │       │
┌──────────▼──┐ ┌──▼───────────┐
│ GitHub MCP  │ │ Postgres MCP │ ... 即插即用的标准服务
└─────────────┘ └──────────────┘
```

### MCP 提供的三大核心原语

1. **Tools (工具)**：允许模型执行具有副作用的操作（如创建 Git 分支、执行数据库更新、发送邮件）。
2. **Resources (资源)**：像只读文件一样供模型随时查看的静态或动态数据（如本地文件内容、API 文档）。
3. **Prompts (提示词模板)**：预先编排好的标准化交互工作流。

掌握工具调用与 MCP，意味着前端工程师能够构建真正拥有行动力、能够自主读写本地和云端数据的自动化 Agent 应用。
