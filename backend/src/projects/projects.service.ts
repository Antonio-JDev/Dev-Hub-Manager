import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllForOrganization(organizationId: string) {
    return this.prisma.project.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createForOrganization(
    organizationId: string,
    createdById: string,
    data: { name: string; description?: string | null; dueDate?: Date | null },
  ) {
    const org = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      include: { projects: true },
    });
    if (!org) {
      throw new NotFoundException('Organization not found');
    }

    if (org.subscriptionStatus === 'trial') {
      const projectCount = await this.prisma.project.count({
        where: { organizationId },
      });
      if (projectCount >= 1) {
        throw new ForbiddenException(
          'Limite de 1 projeto atingido no período de trial.',
        );
      }
    }

    const project = await this.prisma.project.create({
      data: {
        organizationId,
        createdById,
        name: data.name,
        description: data.description ?? null,
        dueDate: data.dueDate ?? null,
      },
    });

    return project;
  }
}