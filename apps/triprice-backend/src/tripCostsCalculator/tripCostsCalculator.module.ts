import { Module } from '@nestjs/common';
import { GraphqlModule } from '../graphql/graphql.module';
import { TripsCostsCalculatorService } from './tripCostsCalculator.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TripsCostsCalculatorController } from './trips.controller';

@Module({
  imports: [GraphqlModule, ScheduleModule.forRoot()],
  providers: [TripsCostsCalculatorService], 
  exports: [TripsCostsCalculatorService],
  controllers: [TripsCostsCalculatorController],
})
export class TripsCostsCalculatorModule { 
 
    
}
