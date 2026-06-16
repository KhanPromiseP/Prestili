import { NextRequest, NextResponse } from 'next/server';
import { presentationRepository } from '@prestili/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const presentation = await presentationRepository.findById(params.id);

    if (!presentation) {
      return NextResponse.json(
        { error: 'Presentation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(presentation);
  } catch (error) {
    console.error('Error fetching presentation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch presentation' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, description, document, slideCount, version } = body;

    const presentation = await presentationRepository.update(params.id, {
      title,
      description,
      document,
      slideCount,
      version,
    });

    return NextResponse.json(presentation);
  } catch (error) {
    console.error('Error updating presentation:', error);
    return NextResponse.json(
      { error: 'Failed to update presentation' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await presentationRepository.delete(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting presentation:', error);
    return NextResponse.json(
      { error: 'Failed to delete presentation' },
      { status: 500 }
    );
  }
}
