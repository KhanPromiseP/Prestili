import OpenAI from 'openai';
import { BaseProvider } from './base';
import { GenerationOptions, ProviderConfig } from '../types/providers';

export class OpenAIProvider extends BaseProvider {
  private client: OpenAI;

  constructor(config: ProviderConfig) {
    super(config, 'OpenAI');
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseURL,
    });
  }

  async generateText(prompt: string, options?: GenerationOptions): Promise<string> {
    const mergedOptions = this.mergeOptions(options);
    
    const response = await this.client.chat.completions.create({
      model: mergedOptions.model || this.config.defaultModel || 'gpt-4',
      messages: [
        ...(mergedOptions.systemMessage ? [{ role: 'system' as const, content: mergedOptions.systemMessage }] : []),
        { role: 'user' as const, content: prompt },
      ],
      temperature: mergedOptions.temperature,
      max_tokens: mergedOptions.maxTokens,
      top_p: mergedOptions.topP,
      frequency_penalty: mergedOptions.frequencyPenalty,
      presence_penalty: mergedOptions.presencePenalty,
      stop: mergedOptions.stopSequences,
    });

    return response.choices[0]?.message?.content || '';
  }

  async *generateTextStream(prompt: string, options?: GenerationOptions): AsyncGenerator<string> {
    const mergedOptions = this.mergeOptions(options);
    
    const stream = await this.client.chat.completions.create({
      model: mergedOptions.model || this.config.defaultModel || 'gpt-4',
      messages: [
        ...(mergedOptions.systemMessage ? [{ role: 'system' as const, content: mergedOptions.systemMessage }] : []),
        { role: 'user' as const, content: prompt },
      ],
      temperature: mergedOptions.temperature,
      max_tokens: mergedOptions.maxTokens,
      top_p: mergedOptions.topP,
      frequency_penalty: mergedOptions.frequencyPenalty,
      presence_penalty: mergedOptions.presencePenalty,
      stop: mergedOptions.stopSequences,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        yield content;
      }
    }
  }

  async generateJSON<T>(prompt: string, options?: GenerationOptions): Promise<T> {
    const mergedOptions = this.mergeOptions(options);
    
    const response = await this.client.chat.completions.create({
      model: mergedOptions.model || this.config.defaultModel || 'gpt-4',
      messages: [
        ...(mergedOptions.systemMessage ? [{ role: 'system' as const, content: mergedOptions.systemMessage }] : []),
        { role: 'user' as const, content: prompt },
      ],
      temperature: mergedOptions.temperature,
      max_tokens: mergedOptions.maxTokens,
      top_p: mergedOptions.topP,
      frequency_penalty: mergedOptions.frequencyPenalty,
      presence_penalty: mergedOptions.presencePenalty,
      stop: mergedOptions.stopSequences,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content || '{}';
    return JSON.parse(content) as T;
  }

  async *generateJSONStream<T>(prompt: string, options?: GenerationOptions): AsyncGenerator<T> {
    const mergedOptions = this.mergeOptions(options);
    
    const stream = await this.client.chat.completions.create({
      model: mergedOptions.model || this.config.defaultModel || 'gpt-4',
      messages: [
        ...(mergedOptions.systemMessage ? [{ role: 'system' as const, content: mergedOptions.systemMessage }] : []),
        { role: 'user' as const, content: prompt },
      ],
      temperature: mergedOptions.temperature,
      max_tokens: mergedOptions.maxTokens,
      top_p: mergedOptions.topP,
      frequency_penalty: mergedOptions.frequencyPenalty,
      presence_penalty: mergedOptions.presencePenalty,
      stop: mergedOptions.stopSequences,
      response_format: { type: 'json_object' },
      stream: true,
    });

    let buffer = '';
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        buffer += content;
        try {
          const json = JSON.parse(buffer);
          yield json;
          buffer = '';
        } catch {
          // JSON incomplete, continue buffering
        }
      }
    }
  }
}
