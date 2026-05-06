import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type TaskStatusColumn = 'backlog' | 'in_progress' | 'review' | 'done';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async findByProject(projectId: string) {
    return this.prisma.task.findMany({
      where: { projectId },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async updateStatus(
    id: string,
    updates: { statusColumn?: TaskStatusColumn; order?: number },
  ) {
    return this.prisma.task.update({
      where: { id },
      data: updates,
    });
  }
}

