import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';

type TaskStatusColumn = 'backlog' | 'in_progress' | 'review' | 'done';

class UpdateTaskStatusDto {
  @IsOptional()
  @IsEnum(['backlog', 'in_progress', 'review', 'done'])
  statusColumn?: TaskStatusColumn;

  @IsOptional()
  @IsInt()
  order?: number;
}

@Controller('tasks')
@UseGuards(JwtAuthGuard, TenantGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('project/:projectId')
  async listByProject(@Param('projectId') projectId: string) {
    return this.tasksService.findByProject(projectId);
  }

  @Patch(':id')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateTaskStatusDto,
  ) {
    return this.tasksService.updateStatus(id, dto);
  }
}

