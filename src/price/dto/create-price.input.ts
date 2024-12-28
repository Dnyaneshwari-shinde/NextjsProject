import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreatePriceInput {
  @Field()
  tokenName: string;

  @Field()
  price: GLfloat;

  @Field({ nullable: true }) 
  timestamp?: Date;
}
