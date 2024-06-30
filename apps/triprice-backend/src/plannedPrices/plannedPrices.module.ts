import { Module } from '@nestjs/common';
import { GraphqlModule } from '../graphql/graphql.module';
import { PlannedPricesService } from './plannedPrices.service';
import { PlannedPricesController } from './plannedPrices.controller';

@Module({
  imports: [GraphqlModule],
  providers: [PlannedPricesService],
  exports: [PlannedPricesService],
  controllers: [PlannedPricesController],
})
export class PlannedPricesModule { }
