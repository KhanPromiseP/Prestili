import { NextRequest, NextResponse } from 'next/server';
import { ContentAnalysisService, providerRegistry } from '@prestili/ai';
import { initializeAIProviders } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    // Initialize AI providers
    initializeAIProviders();

    const { content, provider } = await request.json();

    const aiProvider = provider ? providerRegistry.get(provider as any) : providerRegistry.getDefault();
    if (!aiProvider) {
      return NextResponse.json(
        { error: 'AI provider not configured' },
        { status: 400 }
      );
    }

    const service = new ContentAnalysisService(aiProvider);
    const analysis = await service.analyzeContent(content);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error analyzing content:', error);
    return NextResponse.json(
      { error: 'Failed to analyze content' },
      { status: 500 }
    );
  }
}
