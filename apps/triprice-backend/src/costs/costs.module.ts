import { Module } from '@nestjs/common';
import { GraphqlModule } from '../graphql/graphql.module';
import { CostsService } from './costs.service';
import { CostsController  } from './costs.controller';

@Module({
  imports: [GraphqlModule],
  providers: [CostsService],
  exports: [CostsService],
  controllers: [CostsController],
})
export class CostsModule { }
