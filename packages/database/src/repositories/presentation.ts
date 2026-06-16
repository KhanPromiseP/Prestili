import prisma from '../client';
// import { PresentationDocument } from '@prestili/shared';

export type PresentationDocument = any;

export class PresentationRepository {
  async findById(id: string) {
    return prisma.presentation.findUnique({
      where: { id },
      include: {
        project: true,
        versions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });
  }

  async findByProject(projectId: string) {
    return prisma.presentation.findMany({
      where: { projectId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findAll() {
    return prisma.presentation.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 50,
      include: {
        project: true,
      },
    });
  }

  async create(data: {
    projectId: string;
    title: string;
    description?: string;
    document: PresentationDocument;
  }) {
    return prisma.presentation.create({
      data: {
        projectId: data.projectId,
        title: data.title,
        description: data.description,
        document: data.document as any,
        slideCount: Object.keys(data.document.structure?.slides || {}).length,
      },
    });
  }

  async update(id: string, data: Partial<{
    title: string;
    description: string;
    document: PresentationDocument;
    slideCount: number;
    version: number;
  }>) {
    return prisma.presentation.update({
      where: { id },
      data: {
        ...data,
        document: data.document as any,
      },
    });
  }

  async delete(id: string) {
    return prisma.presentation.delete({
      where: { id },
    });
  }

  async createVersion(presentationId: string, document: any, version: number, changeLog?: string) {
    return prisma.presentationVersion.create({
      data: {
        presentationId,
        document,
        version,
        changeLog,
      },
    });
  }

  async getVersions(presentationId: string) {
    return prisma.presentationVersion.findMany({
      where: { presentationId },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export const presentationRepository = new PresentationRepository();
