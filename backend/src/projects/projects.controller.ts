import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { CurrentOrganization } from '../common/decorators/current-organization.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

class CreateProjectDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}

@Controller('projects')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async list(@CurrentOrganization() organizationId: string) {
    return this.projectsService.findAllForOrganization(organizationId);
  }

  @Post()
  async create(
    @CurrentOrganization() organizationId: string,
    @CurrentUser() user: { userId: string },
    @Body() dto: CreateProjectDto,
  ) {
    return this.projectsService.createForOrganization(
      organizationId,
      user.userId,
      dto,
    );
  }
}

