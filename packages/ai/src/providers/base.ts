import { AIProvider, GenerationOptions, ProviderConfig } from '../types/providers';

export abstract class BaseProvider implements AIProvider {
  protected config: ProviderConfig;
  public name: string;

  constructor(config: ProviderConfig, name: string) {
    this.config = config;
    this.name = name;
  }

  abstract generateText(prompt: string, options?: GenerationOptions): Promise<string>;
  abstract generateTextStream(prompt: string, options?: GenerationOptions): AsyncGenerator<string>;
  abstract generateJSON<T>(prompt: string, options?: GenerationOptions): Promise<T>;
  abstract generateJSONStream<T>(prompt: string, options?: GenerationOptions): AsyncGenerator<T>;

  protected mergeOptions(options?: GenerationOptions): GenerationOptions {
    return {
      ...this.config.defaultOptions,
      ...options,
    };
  }
}
