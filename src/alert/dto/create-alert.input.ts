import { InputType, Field } from '@nestjs/graphql';
import { AlertCondition } from '../entities/alert.entity';

@InputType()
export class CreateAlertInput {
  @Field()
  userEmail: string;

  @Field()
  tokenName: string;

  @Field()
  priceThreshold: number;

  @Field(() => AlertCondition)
  condition: AlertCondition;
}
