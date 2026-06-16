import prisma from '../client';

export class AssetRepository {
  async findById(id: string) {
    return prisma.asset.findUnique({
      where: { id },
    });
  }

  async findByType(type: string) {
    return prisma.asset.findMany({
      where: { type },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByTags(tags: string[]) {
    return prisma.asset.findMany({
      where: {
        tags: {
          hasSome: tags,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: {
    type: string;
    storageKey: string;
    storageUrl: string;
    size: number;
    mimeType: string;
    metadata?: any;
    tags?: string[];
    source?: string;
    sourceId?: string;
  }) {
    return prisma.asset.create({
      data,
    });
  }

  async delete(id: string) {
    return prisma.asset.delete({
      where: { id },
    });
  }

  async search(query: string) {
    return prisma.asset.findMany({
      where: {
        OR: [
          {
            tags: {
              hasSome: [query],
            },
          },
          {
            metadata: {
              path: [],
              string_contains: query,
            },
          },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export const assetRepository = new AssetRepository();
