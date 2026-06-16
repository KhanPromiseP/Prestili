export interface AIProvider {
  name: string;
  generateText(prompt: string, options?: GenerationOptions): Promise<string>;
  generateTextStream(prompt: string, options?: GenerationOptions): AsyncGenerator<string>;
  generateJSON<T>(prompt: string, options?: GenerationOptions): Promise<T>;
  generateJSONStream<T>(prompt: string, options?: GenerationOptions): AsyncGenerator<T>;
}

export interface GenerationOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stopSequences?: string[];
  systemMessage?: string;
}

export interface ProviderConfig {
  apiKey: string;
  baseURL?: string;
  defaultModel?: string;
  defaultOptions?: GenerationOptions;
}

export type ProviderType = 'openai' | 'nvidia' | 'groq' | 'openrouter';
