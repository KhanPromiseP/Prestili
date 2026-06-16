import { providerRegistry, ProviderConfig, ProviderType } from '@prestili/ai';

// Initialize AI providers from environment variables
export function initializeAIProviders() {
  const providers: { type: ProviderType; config: ProviderConfig }[] = [];

  // NVIDIA (prioritize NVIDIA over other providers)
  const nvidiaKey = process.env.NVIDIA_API_KEY;
  if (nvidiaKey && nvidiaKey.length > 10) {
    providers.push({
      type: 'nvidia',
      config: {
        apiKey: nvidiaKey,
        baseURL: 'https://integrate.api.nvidia.com/v1',
        defaultModel: 'meta/llama-3.1-405b-instruct', // Faster model than nemotron-3-ultra-550b-a55b
        defaultOptions: {
          temperature: 0.7,
          maxTokens: 2000,
        },
      },
    });
  }

  // OpenAI
  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey && openaiKey.length > 10) {
    providers.push({
      type: 'openai',
      config: {
        apiKey: openaiKey,
        defaultModel: 'gpt-4',
        defaultOptions: {
          temperature: 0.7,
          maxTokens: 2000,
        },
      },
    });
  }

  // Groq (only if NVIDIA is not available)
  const groqKey = process.env.GROQ_API_KEY;
  if (groqKey && groqKey.length > 10 && providers.length === 0) {
    providers.push({
      type: 'groq',
      config: {
        apiKey: groqKey,
        baseURL: 'https://api.groq.com/openai/v1',
        defaultModel: 'llama-3.3-70b-versatile',
        defaultOptions: {
          temperature: 0.7,
          maxTokens: 2000,
        },
      },
    });
  }

  // OpenRouter
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  if (openrouterKey && openrouterKey.length > 10) {
    providers.push({
      type: 'openrouter',
      config: {
        apiKey: openrouterKey,
        baseURL: 'https://openrouter.ai/api/v1',
        defaultModel: 'anthropic/claude-3.5-sonnet',
        defaultOptions: {
          temperature: 0.7,
          maxTokens: 2000,
        },
      },
    });
  }

  // Register all providers
  providers.forEach(({ type, config }) => {
    providerRegistry.register(type, config);
  });

  console.log(`Initialized ${providers.length} AI provider(s): ${providers.map(p => p.type).join(', ')}`);
  
  if (providers.length === 0) {
    console.warn('No AI providers configured. Please set OPENAI_API_KEY, NVIDIA_API_KEY, GROQ_API_KEY, or OPENROUTER_API_KEY in your .env file');
  }

  return providers;
}

// Initialize on module load
initializeAIProviders();
