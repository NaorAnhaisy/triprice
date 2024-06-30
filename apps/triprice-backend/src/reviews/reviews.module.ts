import { Module } from '@nestjs/common';
import { GraphqlModule } from '../graphql/graphql.module';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';

@Module({
  imports: [GraphqlModule],
  providers: [ReviewsService],
  exports: [ReviewsService],
  controllers: [ReviewsController],
})
export class ReviewsModule { }
