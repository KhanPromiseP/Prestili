import { NextRequest, NextResponse } from 'next/server';
import { QualityValidationService, providerRegistry } from '@prestili/ai';
import { initializeAIProviders } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    // Initialize AI providers
    initializeAIProviders();

    const { content, design, provider } = await request.json();

    const aiProvider = provider ? providerRegistry.get(provider as any) : providerRegistry.getDefault();
    if (!aiProvider) {
      return NextResponse.json(
        { error: 'AI provider not configured' },
        { status: 400 }
      );
    }

    const service = new QualityValidationService(aiProvider);
    const validation = await service.validateQuality({
      content,
      design,
    });

    return NextResponse.json(validation);
  } catch (error) {
    console.error('Error validating quality:', error);
    return NextResponse.json(
      { error: 'Failed to validate quality' },
      { status: 500 }
    );
  }
}
