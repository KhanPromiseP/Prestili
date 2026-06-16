import { NextRequest, NextResponse } from 'next/server';
import { StructureGenerationService, providerRegistry } from '@prestili/ai';
import { initializeAIProviders } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    // Initialize AI providers
    const providers = initializeAIProviders();

    if (providers.length === 0) {
      return NextResponse.json(
        { error: 'No AI provider configured. Please add an API key (OPENAI_API_KEY, NVIDIA_API_KEY, GROQ_API_KEY, or OPENROUTER_API_KEY) to your .env file' },
        { status: 500 }
      );
    }

    const { topic, audience, duration, purpose, provider } = await request.json();

    const aiProvider = provider ? providerRegistry.get(provider as any) : providerRegistry.getDefault();
    if (!aiProvider) {
      return NextResponse.json(
        { error: 'AI provider not configured' },
        { status: 400 }
      );
    }

    const service = new StructureGenerationService(aiProvider);
    const structure = await service.generateStructure({
      topic,
      audience,
      duration,
      purpose,
    });

    return NextResponse.json(structure);
  } catch (error) {
    console.error('Error generating structure:', error);
    return NextResponse.json(
      { error: 'Failed to generate structure' },
      { status: 500 }
    );
  }
}
