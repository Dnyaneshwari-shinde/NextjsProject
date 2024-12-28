import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum AlertCondition {
  ABOVE = 'above',
  BELOW = 'below',
}


@Entity()
export class Alert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userEmail: string;

  @Column()
  tokenName: string;

  @Column('float')
  priceThreshold: number;

  @Column({
    type: 'enum',
    enum: AlertCondition,
  })
  condition: AlertCondition

  @Column({ default: 'active' })
  status: 'active' | 'triggered';
}
