import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { MailService } from './mail.service';
import { CreateMailInput } from './dto/create-mail.input';
import { UpdateMailInput } from './dto/update-mail.input';

@Resolver('Mail')
export class MailResolver {
  constructor(private readonly mailService: MailService) {}

}
