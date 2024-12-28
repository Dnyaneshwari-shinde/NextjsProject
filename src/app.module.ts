import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PriceModule } from './price/price.module';
// import { AlertModule } from './alert/alert.module';
import { AlertModule } from './alert/alert.module';
import { MailModule } from './mail/mail.module';
import { SwapModule } from './swap/swap.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,    
      username: 'root',
      password: '0HKd`_w|95b2',
      database: 'pricetracker', 
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, 
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: process.env.NODE_ENV !== 'production',
      debug: process.env.NODE_ENV !== 'production',
      typePaths: ['./**/*.graphql'],
    }),
    ScheduleModule.forRoot(),
    PriceModule,
    AlertModule,
    MailModule,
    SwapModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
