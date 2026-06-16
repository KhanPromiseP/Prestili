import { NextRequest, NextResponse } from 'next/server';
import { DesignSystemService, providerRegistry } from '@prestili/ai';
import { initializeAIProviders } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    // Initialize AI providers
    initializeAIProviders();

    const { primaryColor, secondaryColor, typography, layoutStyle, visualStyle, content, provider } = await request.json();

    const aiProvider = provider ? providerRegistry.get(provider as any) : providerRegistry.getDefault();
    if (!aiProvider) {
      return NextResponse.json(
        { error: 'AI provider not configured' },
        { status: 400 }
      );
    }

    const service = new DesignSystemService(aiProvider);
    const design = await service.applyDesignSystem({
      primaryColor,
      secondaryColor,
      typography,
      layoutStyle,
      visualStyle,
      content,
    });

    return NextResponse.json(design);
  } catch (error) {
    console.error('Error applying design system:', error);
    return NextResponse.json(
      { error: 'Failed to apply design system' },
      { status: 500 }
    );
  }
}
