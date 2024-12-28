import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdatePriceInput {
  @Field(() => Int)
  id: number;

  @Field()
  tokenName: string;

  @Field()
  price: number;

  @Field()
  timestamp: Date;
}
