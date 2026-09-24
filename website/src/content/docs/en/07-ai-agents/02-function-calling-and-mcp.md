---
title: 'Tool Calling & Model Context Protocol (MCP)'
description: 'Giving LLMs hands and eyes to interact with external environments and APIs'
---

Isolated chatbots can only regurgitate knowledge frozen in their pre-training weights. When a user asks: "*What is my next meeting tomorrow?*" or demands: "*Refund this order*", the LLM itself cannot query your private database or execute real mutations on third-party services.

**Tool Calling (Function Calling) bridges this gap, giving language models actionable hands and observant eyes.**

---

## 1. The Tool Calling Execution Roundtrip

A common misconception: *Does the LLM execute arbitrary code on its remote cluster?*

**No!** The LLM is strictly an autoregressive token predictor. The actual invocation follows a closed-loop architectural roundtrip:

```text
[User Prompt] "What is the weather in Shanghai today?"
    │
    ▼
[Client Request] Dispatches prompt + tool registry (JSON Schema) to LLM
    │
    ▼
[LLM Reasoning] Decides to call a tool; returns structured invocation payload:
                 { "name": "get_weather", "arguments": { "city": "Shanghai" } }
    │
    ▼
[Client Execution] Client intercepts intent, calls real weather API, gets data:
                   { "temp": "24°C", "condition": "Sunny" }
    │
    ▼
[Follow-up Request] Sends observation back to LLM context
    │
    ▼
[Final Output] "It's 24°C and sunny in Shanghai today—great day for outdoors!"
```

---

## 2. Declaring Tools with JSON Schema

Tool parameters are specified using standard JSON Schema definitions:

```typescript
// tools.ts - Declaring tool schemas
export const weatherTool = {
  type: 'function',
  function: {
    name: 'get_current_weather',
    description: 'Retrieves current live weather data for a specified location',
    parameters: {
      type: 'object',
      properties: {
        city: {
          type: 'string',
          description: 'City name (e.g. Beijing, Shanghai, San Francisco)',
        },
        unit: {
          type: 'string',
          enum: ['celsius', 'fahrenheit'],
          description: 'Temperature scale, defaults to celsius',
        },
      },
      required: ['city'],
    },
  },
};
```

---

## 3. What Is the Model Context Protocol (MCP)?

While custom function calling connects individual endpoints, multiplying tool registries creates severe ecosystem fragmentation.

The **Model Context Protocol (MCP)** acts as an open, universal standard (the "USB-C of AI") for connecting models to data sources and tools:

```text
       ┌───────────────┐
       │   AI Client   │ (Antigravity, Claude Desktop, Cursor)
       └───────┬───────┘
               │ Standard MCP Protocol (JSON-RPC over stdio / SSE)
       ┌───────┴───────┐
       │   MCP Host    │
       └───┬───────┬───┘
           │       │
┌──────────▼──┐ ┌──▼───────────┐
│ GitHub MCP  │ │ Postgres MCP │ ... Plug-and-play standardized servers
└─────────────┘ └──────────────┘
```

### The Three MCP Primitives

1. **Tools**: Stateful operations with side effects (create git branches, write files, dispatch transactions).
2. **Resources**: Read-only static or dynamic context feeds (file contents, database schemas, API specs).
3. **Prompts**: Standardized, reusable conversational workflows.

Mastering Function Calling and MCP empowers frontend developers to engineer autonomous, connected Agent workflows.
