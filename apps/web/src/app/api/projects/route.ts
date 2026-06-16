import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@prestili/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, userId } = body;

    // If no userId provided, create a default user or use an existing one
    let actualUserId = userId;
    if (!actualUserId) {
      // Try to find or create a default user
      let defaultUser = await prisma.user.findFirst({
        where: { email: 'default@prestili.com' },
      });
      
      if (!defaultUser) {
        defaultUser = await prisma.user.create({
          data: {
            email: 'default@prestili.com',
            name: 'Default User',
          },
        });
      }
      
      actualUserId = defaultUser.id;
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        userId: actualUserId,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        presentations: {
          orderBy: { updatedAt: 'desc' },
          take: 5,
        },
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}
