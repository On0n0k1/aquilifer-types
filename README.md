# aquilifer-types

TypeScript types and two tiny runtime helpers for
[`window.aquilifer`](https://github.com/On0n0k1/aquilifer) — the
page-facing global the [Aquilifer](https://github.com/On0n0k1/aquilifer)
browser extension injects into any site it's connected to.

> **Status: early development, not yet published.** This package isn't on
> npm yet.

## What this is

Aquilifer is a browser extension that acts as a MetaMask-style LLM
provider: a website asks `window.aquilifer` for a chat completion, the
extension holds the user's API key and enforces permissions/rate limits,
and the website never sees the credential. This package ships the
TypeScript types for that surface, so a site's own frontend code gets full
typing without hand-copying shapes from documentation — plus two small
helpers for the one existence check every integration needs.

**This is types and helpers only.** No transport, no SDK, nothing a
backend can use — `window.aquilifer` only exists inside a browser tab
where the extension is installed, so this package is frontend-only by
nature.

## Install

```sh
npm install aquilifer-types
```

`@anthropic-ai/sdk` and `openai` are regular dependencies (used for
`import type` only) — they supply the request/response shapes behind the
provider-specific interfaces below, so no separate install is needed for
those to type-check.

## Usage

Importing this package augments the global `Window` interface, so
`window.aquilifer` is typed anywhere in your project once it's imported
somewhere in your dependency graph — no wrapper object to reach for.

### Checking availability

```ts
import { isAquiliferAvailable, getAquilifer } from 'aquilifer-types';

if (isAquiliferAvailable()) {
  // window.aquilifer is present — extension installed and connected
}

const aquilifer = getAquilifer(); // AquiliferGlobal | undefined
```

### The generic interface

Provider-agnostic — works the same regardless of which provider the user
has connected.

```ts
import type { AquiliferChatParams } from 'aquilifer-types';

const params: AquiliferChatParams = {
  messages: [{ role: 'user', content: 'Hello!' }],
};

const result = await window.aquilifer?.request({ method: 'chat', params });

for await (const chunk of window.aquilifer?.stream(params) ?? []) {
  console.log(chunk.delta);
}
```

### Provider-specific interfaces

For a site that wants a specific provider's native request shape instead
of the generic interface — typed as a pass-through of that provider's own
SDK types (`model` and `stream` are controlled by the bound provider and
the method called, not the site):

```ts
import type { AnthropicMessagesRequest } from 'aquilifer-types';

const body: AnthropicMessagesRequest = {
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Hello!' }],
};

const response = await window.aquilifer?.anthropicMessages(body);

for await (const event of window.aquilifer?.anthropicMessagesStream(body) ?? []) {
  // event is Anthropic's own MessageStreamEvent shape
}
```

`openaiChatCompletions` / `openaiChatCompletionsStream` work the same way,
typed against `OpenAIChatCompletionsRequest`.

### Listening for connection changes

`window.aquilifer` is an `EventTarget`:

```ts
window.aquilifer?.addEventListener('connect', (event) => {
  const detail = (event as CustomEvent).detail; // AquiliferProviderInfo
});
window.aquilifer?.addEventListener('disconnect', () => {});
window.aquilifer?.addEventListener('permissionChanged', (event) => {});
```

### Errors

A failed call rejects with an `Error` whose `.code` is set for the stable
identifiers documented in the extension's own API reference (e.g.
`not_connected`, `rate_limited`) — see
[`AquiliferError`](./src/types.ts) and the extension's docs site for the
full table.

## What's exported

- **Types**: `AquiliferChatParams`, `AquiliferProviderInfo`,
  `AquiliferGenericRequestPayload`, `AquiliferStreamChunk`,
  `AquiliferPageEvent`, `AquiliferError`, `AquiliferGlobal`, plus the
  provider-specific request/response/stream types for both Anthropic and
  OpenAI-compatible interfaces.
- **Helpers**: `getAquilifer()`, `isAquiliferAvailable()`.

Everything above is erased at compile time except the two helpers, which
are a few lines each — importing this package costs nothing in your
shipped bundle beyond what you actually call.

## Relationship to the extension repo

This package's types are hand-ported from
[aquilifer-ext](https://github.com/On0n0k1/aquilifer)'s
`lib/public-api.ts`, not generated or imported at build time. It's
deliberately a separate repo with its own independent versioning rather
than a monorepo package, so a commit here only bumps this package's
version when its own public surface actually changes.

## License

Apache-2.0 — see [LICENSE](./LICENSE).
