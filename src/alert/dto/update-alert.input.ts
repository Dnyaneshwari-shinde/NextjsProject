import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateAlertStatusInput {
  @Field(() => Int)
  id: number;

  @Field()
  status: 'active' | 'triggered';
}
