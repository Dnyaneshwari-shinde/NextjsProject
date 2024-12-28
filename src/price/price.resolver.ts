import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { PriceService } from './price.service';
import { Price } from './entities/price.entity';
import { CreatePriceInput } from './dto/create-price.input';

@Resolver(() => Price)
export class PriceResolver {
  constructor(private readonly priceService: PriceService) {}

  @Mutation(() => Price)  // Specify the return type for the mutation
  async createPrice(
    @Args('createPriceInput') createPriceInput: CreatePriceInput,
  ): Promise<Price> {  // The return type should be a Price object
    return this.priceService.create(createPriceInput);
  }
}
