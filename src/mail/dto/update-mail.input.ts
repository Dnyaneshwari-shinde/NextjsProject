import { CreateMailInput } from './create-mail.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateMailInput extends PartialType(CreateMailInput) {
  id: number;
}
