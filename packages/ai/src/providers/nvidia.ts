import { BaseProvider } from './base';
import { GenerationOptions, ProviderConfig } from '../types/providers';

export class NVIDIAProvider extends BaseProvider {
  private baseURL: string;

  constructor(config: ProviderConfig) {
    super(config, 'NVIDIA');
    this.baseURL = config.baseURL || 'https://integrate.api.nvidia.com/v1';
  }

  async generateText(prompt: string, options?: GenerationOptions): Promise<string> {
    const mergedOptions = this.mergeOptions(options);
    
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: mergedOptions.model || this.config.defaultModel || 'nvidia/nemotron-3-ultra-550b-a55b',
        messages: [
          ...(mergedOptions.systemMessage ? [{ role: 'system', content: mergedOptions.systemMessage }] : []),
          { role: 'user', content: prompt },
        ],
        temperature: mergedOptions.temperature,
        max_tokens: mergedOptions.maxTokens,
        top_p: mergedOptions.topP,
        frequency_penalty: mergedOptions.frequencyPenalty,
        presence_penalty: mergedOptions.presencePenalty,
        stop: mergedOptions.stopSequences,
      }),
    });

    if (!response.ok) {
      throw new Error(`NVIDIA API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }

  async *generateTextStream(prompt: string, options?: GenerationOptions): AsyncGenerator<string> {
    const mergedOptions = this.mergeOptions(options);
    
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: mergedOptions.model || this.config.defaultModel || 'meta/llama-3.1-405b-instruct',
        messages: [
          ...(mergedOptions.systemMessage ? [{ role: 'system', content: mergedOptions.systemMessage }] : []),
          { role: 'user', content: prompt },
        ],
        temperature: mergedOptions.temperature,
        max_tokens: mergedOptions.maxTokens,
        top_p: mergedOptions.topP,
        frequency_penalty: mergedOptions.frequencyPenalty,
        presence_penalty: mergedOptions.presencePenalty,
        stop: mergedOptions.stopSequences,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`NVIDIA API error: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;
          
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices[0]?.delta?.content;
            if (content) yield content;
          } catch {
            // Skip invalid JSON
          }
        }
      }
    }
  }

  async generateJSON<T>(prompt: string, options?: GenerationOptions): Promise<T> {
    const mergedOptions = this.mergeOptions(options);
    
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: mergedOptions.model || this.config.defaultModel || 'meta/llama-3.1-405b-instruct',
        messages: [
          ...(mergedOptions.systemMessage ? [{ role: 'system', content: mergedOptions.systemMessage }] : []),
          { role: 'user', content: prompt },
        ],
        temperature: mergedOptions.temperature,
        max_tokens: mergedOptions.maxTokens,
        top_p: mergedOptions.topP,
        frequency_penalty: mergedOptions.frequencyPenalty,
        presence_penalty: mergedOptions.presencePenalty,
        stop: mergedOptions.stopSequences,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('NVIDIA API error response:', errorText);
      throw new Error(`NVIDIA API error: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '{}';
    
    try {
      return JSON.parse(content) as T;
    } catch (error) {
      console.error('Failed to parse NVIDIA JSON response:', content);
      throw new Error(`Invalid JSON response from NVIDIA: ${content.substring(0, 200)}...`);
    }
  }

  async *generateJSONStream<T>(prompt: string, options?: GenerationOptions): AsyncGenerator<T> {
    const mergedOptions = this.mergeOptions(options);
    
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: mergedOptions.model || this.config.defaultModel || 'meta/llama-3.1-405b-instruct',
        messages: [
          ...(mergedOptions.systemMessage ? [{ role: 'system', content: mergedOptions.systemMessage }] : []),
          { role: 'user', content: prompt },
        ],
        temperature: mergedOptions.temperature,
        max_tokens: mergedOptions.maxTokens,
        top_p: mergedOptions.topP,
        frequency_penalty: mergedOptions.frequencyPenalty,
        presence_penalty: mergedOptions.presencePenalty,
        stop: mergedOptions.stopSequences,
        response_format: { type: 'json_object' },
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`NVIDIA API error: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    let buffer = '';
    let jsonBuffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;
          
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices[0]?.delta?.content;
            if (content) {
              jsonBuffer += content;
              try {
                const json = JSON.parse(jsonBuffer);
                yield json;
                jsonBuffer = '';
              } catch {
                // JSON incomplete, continue buffering
              }
            }
          } catch {
            // Skip invalid JSON
          }
        }
      }
    }
  }
}
