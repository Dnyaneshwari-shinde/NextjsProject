import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PriceService } from './price.service';
import { PriceResolver } from './price.resolver';
import { Price } from './entities/price.entity';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([Price]), MailModule],
  providers: [PriceResolver, PriceService],
})
export class PriceModule {}
