import { NextRequest, NextResponse } from 'next/server';
import { presentationRepository } from '@prestili/database';
import { PresentationDocument, generateId } from '@prestili/shared';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, title, description, document } = body;

    const presentation = await presentationRepository.create({
      projectId,
      title,
      description,
      document,
    });

    return NextResponse.json(presentation, { status: 201 });
  } catch (error) {
    console.error('Error creating presentation:', error);
    return NextResponse.json(
      { error: 'Failed to create presentation' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    // If no projectId provided, return all presentations (for dashboard)
    if (!projectId) {
      try {
        const presentations = await presentationRepository.findAll();
        return NextResponse.json(presentations);
      } catch (error) {
        console.warn('Error fetching all presentations:', error);
        return NextResponse.json([]);
      }
    }

    const presentations = await presentationRepository.findByProject(projectId);
    return NextResponse.json(presentations);
  } catch (error) {
    console.error('Error fetching presentations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch presentations' },
      { status: 500 }
    );
  }
}
