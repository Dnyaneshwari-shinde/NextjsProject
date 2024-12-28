import { CreateSwapInput } from './create-swap.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateSwapInput extends PartialType(CreateSwapInput) {
  id: number;
}
