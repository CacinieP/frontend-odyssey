---
title: 'Browser LLM Integration & Streaming Responses'
description: 'Building typewriter visual effects, parsing Server-Sent Events, handling abortable requests, and choosing between fetch and EventSource'
---

In the age of AI, the role of frontend engineers is evolving rapidly: **we are moving beyond crafting static pixel layouts to becoming Intelligent Interface Architects who seamlessly bridge LLM reasoning with responsive user experiences**.

In traditional REST APIs, the browser sends a request and waits for a consolidated JSON object. But because LLM autoregressive token generation takes several seconds or minutes, making users stare at a blank screen produces an unacceptable experience. **Streaming is the lifeline of modern AI user interfaces.**

---

## 1. The Critical Importance of Streaming

- **Time to First Token (TTFT)**: Streaming means users see the first piece of output without waiting for the model to finish the whole response. Typical TTFT ranges from a few hundred milliseconds to several seconds depending on **queue depth, prefill time, model size, and network latency** — there is no universal SLA.
- **Typewriter Visual Cadence**: Tokens appear progressively as the model generates them, mirroring the natural rhythm of human thought.

> 💡 Two paths to consume a stream from the browser: **`fetch` + `ReadableStream`** (full control, you parse) and the native **`EventSource`** (GET-only, browser parses for you). We cover both below.

---

## 2. fetch + ReadableStream: full control, you parse

`fetch` returns a `ReadableStream<Uint8Array>` of raw bytes. To turn those bytes into *SSE events* you must parse them yourself — `fetch` does not strip `data:` prefixes, does not merge multi-line `data:`, and does not split on the blank line that delimits events.

### 2.1 A real SSE parser

```typescript
// streaming-client.ts - Browser-side SSE consumer
export type SSEEvent = {
  event: string;
  data: string;
  id: string | null;
  retry: number | null;
};

// Parse complete SSE events out of an arbitrary byte buffer.
// Returns any leftover partial event to be prepended to the next chunk.
export function parseSSEBuffer(buffer: string, onEvent: (e: SSEEvent) => void): string {
  // SSE spec: events are separated by a blank line (\n\n).
  // A single event may contain multiple "data:" lines joined by \n.
  // Comments start with ":". Unknown fields are ignored.
  let remaining = buffer;
  let idx: number;
  while ((idx = remaining.indexOf('\n\n')) !== -1) {
    const raw = remaining.slice(0, idx);
    remaining = remaining.slice(idx + 2);

    const lines = raw.split('\n');
    const event: SSEEvent = { event: 'message', data: '', id: null, retry: null };
    const dataLines: string[] = [];

    for (const line of lines) {
      if (line.startsWith(':')) continue;                        // SSE comment
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
  let buffer = '';                       // carries partial events across chunks
  let done = false;

  while (!done) {
    const { value, done: readerDone } = await reader.read();
    done = readerDone;
    if (!value) continue;
    buffer += decoder.decode(value, { stream: true });
    buffer = parseSSEBuffer(buffer, (e) => {
      if (e.event === 'done') { done = true; return; }
      // Body could be JSON-encoded text deltas; adapt as needed.
      try { onChunk((JSON.parse(e.data) as { text: string }).text); }
      catch { onChunk(e.data); }
    });
  }
  // Flush the decoder to handle UTF-8 multi-byte sequences split across chunks.
  buffer += decoder.decode();
  if (buffer.trim()) buffer = parseSSEBuffer(buffer + '\n\n', onEvent);
}
```

Three things to notice:

- `reader.read()` returns *bytes*, not events — one chunk may be a fragment of one event, several events, or split a UTF-8 multi-byte character.
- The parser must therefore be **stateful across chunks**. The leftover partial event is returned and prepended next round.
- `TextDecoder` only handles UTF-8 boundaries, **not** SSE message boundaries.

If your server already strips SSE wrapping and ships plain text chunks, replace the parser with a single `decoder.decode(value, { stream: true })` line — but rename this section accordingly.

---

## 3. Native EventSource: GET-only, browser parses for you

When the server can offer a plain `GET /api/events` endpoint that returns `text/event-stream`, the browser does the parsing for you.

```typescript
const source = new EventSource('/api/events');

// Default event ("message"):
source.onmessage = (event) => {
  // event.data is the parsed SSE payload (no `data:` prefix)
  console.log(event.data);
};

// Server-defined custom events:
source.addEventListener('done', () => {
  source.close();   // tidy shutdown
});

source.onerror = () => {
  // ⚠️ Do NOT call source.close() unconditionally here — EventSource has
  // built-in reconnect with exponential back-off. Closing on every error
  // will fight that and is a common footgun.
  console.error('connection issue', source.readyState);
  // EVENTSource.CLOSED = 2 → only then close; otherwise let it reconnect.
};
```

### 3.1 When to use which

| Capability | Browser-native `EventSource` | `fetch` + `ReadableStream` |
| --- | --- | --- |
| HTTP method | GET only | any (POST/PUT/…) |
| Headers / body | not settable | full control |
| Auth (Bearer / Cookie) | only via cookie (`withCredentials`) | any header |
| SSE parsing | browser handles it | you parse it yourself |
| Reconnect | built-in (with `retry: ms`) | manual |
| Stop | `source.close()` | `controller.abort()` |

**Pick `EventSource`** for one-way server→client feeds (live logs, notifications, progress) on a public endpoint.

**Pick `fetch`** whenever you need a POST body, custom auth headers, or to send the user's prompt with the request — which is exactly what a chat completion needs.

---

## 4. Implementing a Streaming Component in React

Combining native streams with React state creates a clean typewriter interface:

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
        console.log('User cancelled generation');
      } else {
        console.error('Generation failed:', err);
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  const handleStop = () => {
    abortControllerRef.current?.abort(); // Aborts the browser HTTP stream
  };

  return (
    <div className="chat-container">
      <div className="output-area">{response || 'Ask anything...'}</div>
      <div className="controls">
        <input value={input} onChange={(e) => setInput(e.target.value)} />
        {isGenerating ? (
          <button onClick={handleStop} className="btn-danger">Stop</button>
        ) : (
          <button onClick={handleSend} className="btn-primary">Generate</button>
        )}
      </div>
    </div>
  );
}
```

---

## 5. Key Production Considerations

1. **Rendering Throttling**: When high-throughput models produce hundreds of tokens per second, calling state setters on every chunk can cause UI jank. In production, buffer chunks through `requestAnimationFrame`.
2. **Incremental Markdown Rendering**: Use streaming-aware AST parsers to prevent premature code-block syntax-highlight flickering before closing backticks arrive.
3. **Abort semantics**: `controller.abort()` cancels the browser HTTP stream, but the upstream model may keep generating and billing unless the server propagates `req.signal` to the model client (e.g. Anthropic SDK's `client.messages.stream({ …, signal })`). Billing depends on the vendor's per-token policy — verify in their docs.
4. **Persistence and resumption**: Neither `fetch` nor `EventSource` resumes from the last byte after a network blip. For long-running sessions, design the server to be idempotent or stream resumable IDs (the SSE `id:` field is your friend).