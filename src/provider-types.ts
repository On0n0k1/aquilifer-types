// Provider-specific request/response/stream types, hand-ported from
// aquilifer-ext's lib/provider-interfaces/{anthropic,openai-compatible}.ts
// (SPEC.md §4 — this package never imports from that repo directly, only
// copies its type shapes). Derived via Omit<> from the official SDKs' own
// types so a caller already familiar with Anthropic's or OpenAI's native
// request shape gets zero-friction parity; `model` and `stream` are omitted
// because Aquilifer controls both (the bound provider's model, and whether
// the non-streaming or streaming variant was called) rather than the site.

import type Anthropic from '@anthropic-ai/sdk';
import type OpenAI from 'openai';

export type AnthropicMessagesRequest = Omit<
  Anthropic.MessageCreateParamsNonStreaming,
  'model' | 'stream'
>;
export type AnthropicMessagesResponse = Anthropic.Message;
export type AnthropicMessagesStreamEvent = Anthropic.MessageStreamEvent;

export type OpenAIChatCompletionsRequest = Omit<
  OpenAI.ChatCompletionCreateParamsNonStreaming,
  'model' | 'stream'
>;
export type OpenAIChatCompletionsResponse = OpenAI.ChatCompletion;
export type OpenAIChatCompletionsStreamChunk = OpenAI.ChatCompletionChunk;
