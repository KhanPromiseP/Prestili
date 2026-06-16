import { NextRequest, NextResponse } from 'next/server';
import { AssetSelectionService, providerRegistry } from '@prestili/ai';
import { initializeAIProviders } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    // Initialize AI providers
    initializeAIProviders();

    const { content, theme, style, provider } = await request.json();

    const aiProvider = provider ? providerRegistry.get(provider as any) : providerRegistry.getDefault();
    if (!aiProvider) {
      return NextResponse.json(
        { error: 'AI provider not configured' },
        { status: 400 }
      );
    }

    const service = new AssetSelectionService(aiProvider);
    const assets = await service.suggestAssets({
      content,
      theme,
      style,
    });

    return NextResponse.json(assets);
  } catch (error) {
    console.error('Error suggesting assets:', error);
    return NextResponse.json(
      { error: 'Failed to suggest assets' },
      { status: 500 }
    );
  }
}
