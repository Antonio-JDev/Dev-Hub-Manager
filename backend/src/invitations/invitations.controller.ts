import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { IsEmail, IsString } from 'class-validator';
import { InvitationsService } from './invitations.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { CurrentOrganization } from '../common/decorators/current-organization.decorator';

class CreateInvitationDto {
  @IsEmail()
  email: string;

  @IsString()
  role: string;
}

@Controller('invitations')
@UseGuards(JwtAuthGuard, TenantGuard)
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Post()
  async create(
    @CurrentOrganization() organizationId: string,
    @Body() dto: CreateInvitationDto,
  ) {
    return this.invitationsService.createInvitation(organizationId, dto);
  }
}

