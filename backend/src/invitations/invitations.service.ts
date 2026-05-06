import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomUUID } from 'crypto';

@Injectable()
export class InvitationsService {
  constructor(private readonly prisma: PrismaService) {}

  async createInvitation(
    organizationId: string,
    data: { email: string; role: string },
  ) {
    const org = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });
    if (!org) {
      throw new NotFoundException('Organization not found');
    }

    if (org.subscriptionStatus === 'trial') {
      const inviteCount = await this.prisma.invitation.count({
        where: { organizationId },
      });
      if (inviteCount >= 1) {
        throw new ForbiddenException(
          'Limite de 1 convite atingido no período de trial.',
        );
      }
    }

    const invitation = await this.prisma.invitation.create({
      data: {
        organizationId,
        email: data.email,
        role: data.role,
        token: randomUUID(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return invitation;
  }
}

