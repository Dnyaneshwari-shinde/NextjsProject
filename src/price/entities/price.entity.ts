import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Price {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  tokenName: string;

  @Column('float')
  @Field()
  price: GLfloat;

  @Column('timestamp')
  @Field()
  timestamp: Date;
}
