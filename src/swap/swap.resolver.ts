import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { SwapService } from './swap.service';
import { CreateSwapInput } from './dto/create-swap.input';
import { UpdateSwapInput } from './dto/update-swap.input';
import { Get } from '@nestjs/common';

@Resolver('Swap')
export class SwapResolver {
  constructor(private readonly swapService: SwapService) {}

  
  @Query('rate')
  async getSwapRate(ethAmount: number) {
    if (!ethAmount) {
      throw new Error('ETH amount is required');
    }
    return this.swapService.getSwapDetails(ethAmount);
  }
}
