import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Webhook } from './entity/webhook.entity';

@Injectable()
export class WebhooksService {
  constructor(
    @InjectRepository(Webhook)
    private webhooksRepository: Repository<Webhook>,
  ) {}

  async create(webhook: Partial<Webhook>): Promise<Webhook> {
    const newWebhook = this.webhooksRepository.create(webhook);
    return this.webhooksRepository.save(newWebhook);
  }

  async findAll(): Promise<Webhook[]> {
    return this.webhooksRepository.find();
  }

  async findByUser(user: string): Promise<Webhook[]> {
    return this.webhooksRepository.find({ where: { user } });
  }

  async delete(webhook: Partial<Webhook>): Promise<void> {
    await this.webhooksRepository.delete({
      url: webhook.url,
      user: webhook.user,
    });
  }
}
