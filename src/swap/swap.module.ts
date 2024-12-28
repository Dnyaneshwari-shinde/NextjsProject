import { Module } from '@nestjs/common';
import { SwapService } from './swap.service';
import { SwapResolver } from './swap.resolver';

@Module({
  providers: [SwapResolver, SwapService],
})
export class SwapModule {}
