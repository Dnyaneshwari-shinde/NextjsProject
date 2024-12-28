import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { AlertService } from './alert.service';
import { Alert, AlertCondition } from './entities/alert.entity';
import { CreateAlertInput } from './dto/create-alert.input';
import { UpdateAlertStatusInput } from './dto/update-alert.input';

@Resolver(() => Alert)
export class AlertResolver {
  constructor(private readonly alertService: AlertService) {}

  // Query to fetch all active alerts
  @Query(() => [Alert], { name: 'activeAlerts' })
  async getActiveAlerts(): Promise<Alert[]> {
    return this.alertService.getActiveAlerts();
  }

  // Mutation to add a new alert
  @Mutation(() => Alert)
  async createAlert(
    @Args('createAlertInput') createAlertInput: CreateAlertInput,
  ): Promise<Alert> {
    const { userEmail, tokenName, priceThreshold, condition } = createAlertInput;
    return this.alertService.addAlert(userEmail, tokenName, priceThreshold, condition);
  }

  @Mutation(() => Boolean)
  async updateAlertStatus(
    @Args('updateAlertStatusInput') updateAlertStatusInput: UpdateAlertStatusInput,
  ): Promise<boolean> {
    const { id, status } = updateAlertStatusInput;
    await this.alertService.updateAlertStatus(id, status);
    return true;
  }
}
