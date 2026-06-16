import prisma from '../client';

export class UserRepository {
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        projects: true,
        subscriptions: true,
      },
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: {
    email: string;
    name?: string;
    image?: string;
  }) {
    return prisma.user.create({
      data,
    });
  }

  async update(id: string, data: Partial<{
    name: string;
    image: string;
  }>) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  }
}

export const userRepository = new UserRepository();
