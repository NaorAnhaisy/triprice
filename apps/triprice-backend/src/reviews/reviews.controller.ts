import { Controller, Get, Post, Request } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) { }

  @Post('create')
  async create(@Request() req) {
    return this.reviewsService.insertOneReview(req.body);
  }

  @Post('update')
  async update(@Request() req) {
    return await this.reviewsService.updateOneReview(req.body);
  }

  @Post('remove')
  async remove(@Request() req) {
    return await this.reviewsService.removeOneReview(req.body.id);
  }

  @Get('')
  async getReviews() {
    return this.reviewsService.findReviews();
  }
}
