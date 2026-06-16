import { NextRequest, NextResponse } from 'next/server';
import { providerRegistry, GlobalMapService } from '@prestili/ai';
import { initializeAIProviders } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    // Initialize AI providers
    initializeAIProviders();

    const body = await request.json();
    const { structure } = body;

    if (!structure) {
      return NextResponse.json(
        { error: 'Structure is required' },
        { status: 400 }
      );
    }

    const globalMapService = new GlobalMapService(providerRegistry.getDefault());
    const globalMap = await globalMapService.generateGlobalMap(structure);

    return NextResponse.json(globalMap);
  } catch (error) {
    console.error('Error generating global map:', error);
    return NextResponse.json(
      { error: 'Failed to generate global map' },
      { status: 500 }
    );
  }
}
