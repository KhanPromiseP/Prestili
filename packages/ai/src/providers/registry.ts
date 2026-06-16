import { AIProvider, ProviderConfig, ProviderType } from '../types/providers';
import { OpenAIProvider } from './openai';
import { NVIDIAProvider } from './nvidia';
import { GroqProvider } from './groq';
import { OpenRouterProvider } from './openrouter';

export class ProviderRegistry {
  private providers: Map<string, AIProvider> = new Map();

  register(type: ProviderType, config: ProviderConfig): AIProvider {
    let provider: AIProvider;

    switch (type) {
      case 'openai':
        provider = new OpenAIProvider(config);
        break;
      case 'nvidia':
        provider = new NVIDIAProvider(config);
        break;
      case 'groq':
        provider = new GroqProvider(config);
        break;
      case 'openrouter':
        provider = new OpenRouterProvider(config);
        break;
      default:
        throw new Error(`Unknown provider type: ${type}`);
    }

    this.providers.set(type, provider);
    return provider;
  }

  get(type: ProviderType): AIProvider | undefined {
    return this.providers.get(type);
  }

  getDefault(): AIProvider {
    // Default to NVIDIA if available (prioritized), then OpenAI, then others
    const provider = this.providers.get('nvidia') || 
           this.providers.get('openai') || 
           this.providers.get('groq') || 
           this.providers.get('openrouter');
    
    if (!provider) {
      throw new Error('No AI provider registered. Please register at least one provider.');
    }
    
    return provider;
  }

  list(): string[] {
    return Array.from(this.providers.keys());
  }
}

// Global registry instance
export const providerRegistry = new ProviderRegistry();
