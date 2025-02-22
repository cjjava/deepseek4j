// src/app/models/chat-completion-response.ts
export interface ChatCompletionResponse {
  id: string;
  created: number;
  model: string;
  choices: ChatCompletionChoice[];
  usage: Usage;
}

export interface ChatCompletionChoice {
  index: number;
  message: AssistantMessage;
  delta: Delta;
  finish_reason: string;
}

export interface AssistantMessage {
  role: string;
  content: string;
  reasoning_content: string;
}

export interface Delta {
  role?: string;
  content?: string;
  reasoning_content?: string;
}

export interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}
