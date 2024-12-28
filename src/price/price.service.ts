import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Moralis from 'moralis';
import { EvmChain } from '@moralisweb3/common-evm-utils';

import { Price } from './entities/price.entity';
import { CreatePriceInput } from './dto/create-price.input';
import { UpdatePriceInput } from './dto/update-price.input';
import { MailService } from '../mail/mail.service';

const tokens = [{ name: "eth", network : "ETHEREUM", address : "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"},
                { name : "matic", network : "PLOYGON",  address : "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270"}];


@Injectable()
export class PriceService {
  private readonly logger = new Logger(PriceService.name);

  constructor( @InjectRepository(Price)
    private priceRepository: Repository<Price>,
    private mailService: MailService,
  ) {}

  async onModuleInit() {
    try {
      await Moralis.start({
        apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjhjMjczNDYxLWFkYWYtNDE5OC05MjgzLWM2MjNkYzlkMDk3MyIsIm9yZ0lkIjoiMjAxNTQwIiwidXNlcklkIjoiMjAxMjE0IiwidHlwZUlkIjoiOWUxNWRmZDYtYjhjYS00ZDVmLTgyNzgtMTg0NTI2ZWQ0NWJmIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE2OTI3OTYxNjQsImV4cCI6NDg0ODU1NjE2NH0.zeHoas_s-Ue9u2W20Gs3VH4IQYfD2Uj9RbNPJMU7hrs",
      });
      this.logger.log('Moralis initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Moralis', error);
    }
  }

  @Cron('*/5 * * * *') // Runs every 5 minutes
  async fetchAndSavePrices() {
    this.logger.log('Fetching prices...');
      await Promise.all(
        tokens.map(async (token) => {
          const {name, network, address } = token;  
          console.log(network, address )
          try {
            // Call Moralis API for price
            const response = await Moralis.EvmApi.token.getTokenPrice({
              chain: network === 'ETHEREUM' ? EvmChain.ETHEREUM : EvmChain.POLYGON,
              address: address,
            });
            const tokenPrice = response.raw.usdPrice; 
            console.log("tokenPrice", tokenPrice);
            const price = this.priceRepository.create({
              tokenName : name,
              price :  parseFloat(tokenPrice.toString()),
              timestamp: new Date(),
            });
            return this.priceRepository.save(price);
          } catch (error) {
            this.logger.error(
              `Failed to fetch or save price for ${network} token ${address}`,
              error,
            );
          }
        }))
      this.logger.log('Prices saved successfully!');
  }


   // Cron job to check price increase every hour
   @Cron('0 * * * *') // Runs every hour
   async checkPriceIncrease(): Promise<void> {
     const now = new Date();
     const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
 
     // get the latest price & the price from 1 hour ago
     const latestPrice = await this.priceRepository
       .createQueryBuilder('price').where('price.timestamp <= :now', { now })
       .orderBy('price.timestamp', 'DESC').limit(1).getOne();
 
     const priceOneHourAgo = await this.priceRepository
       .createQueryBuilder('price')
       .where('price.timestamp <= :oneHourAgo', { oneHourAgo }).orderBy('price.timestamp', 'DESC')
       .limit(1).getOne();
 
     if (latestPrice && priceOneHourAgo) {
       const priceIncrease = ((latestPrice.price - priceOneHourAgo.price) / priceOneHourAgo.price) * 100;
 
       if (priceIncrease > 3) {
         // Send email
         const subject = `Price Alert: ${latestPrice.tokenName} Price Increased by ${priceIncrease.toFixed(2)}%`;
         const text = `The price of ${latestPrice.tokenName} has increased by ${priceIncrease.toFixed(2)}% in the last hour. The latest price is $${latestPrice.price}.`;
 
         await this.mailService.sendEmail(subject, text);
       }
     }
   }

  async create(createPriceInput: CreatePriceInput): Promise<Price> {
    console.log("data", createPriceInput)
    const price = this.priceRepository.create({
      ...createPriceInput,
      timestamp: createPriceInput.timestamp || new Date(), 
    });
    return this.priceRepository.save(price);
  }

  // Fetch hourly prices for the last 24 hours
  async fetchHourlyPrices(): Promise<any> {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const hourlyPrices = await this.priceRepository
      .createQueryBuilder('price')
      .select("DATE_TRUNC('hour', price.timestamp) AS hour, AVG(price.price) AS avg_price") // Adjust for MySQL if needed
      .where('price.timestamp >= :oneDayAgo', { oneDayAgo })
      .groupBy('hour').orderBy('hour', 'DESC').getRawMany();

    return hourlyPrices;
  }

}
