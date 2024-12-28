import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Alert, AlertCondition } from './entities/alert.entity';
import { MailService } from '../mail/mail.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AlertService {
  constructor(
    @InjectRepository(Alert) private alertRepository: Repository<Alert>,
    private readonly mailService: MailService,
  ) {}

  async addAlert(
    userEmail: string,
    tokenName: string,
    priceThreshold: number,
    condition: AlertCondition,
  ): Promise<Alert> {
    const alert = this.alertRepository.create({
      userEmail,
      tokenName,
      priceThreshold,
      condition,
    });
    return this.alertRepository.save(alert);
  }


  async getActiveAlerts(): Promise<Alert[]> {
    return this.alertRepository.find({ where: { status: 'active' } });
  }

  async updateAlertStatus(id: number, status: 'active' | 'triggered'): Promise<void> {
    await this.alertRepository.update(id, { status });
  }
}
