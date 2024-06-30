import { Injectable } from "@nestjs/common";
import { Review } from "apps/shared/models/reviews/review";
import { ResponseOnUserPostRequest } from "apps/shared/models/users/user";
import { GraphqlService } from "../graphql/graphql.service";

@Injectable()
export class ReviewsService {
  constructor(private readonly graphqlService: GraphqlService) { }

  public async insertOneReview(review: Review): Promise<ResponseOnUserPostRequest> {
    return this.graphqlService.insertOneReview(review);
  }

  public async updateOneReview(review: Review): Promise<ResponseOnUserPostRequest> {
    return await this.graphqlService.updateOneReview(review);
  }

  public async findReviews(): Promise<Review[]> {
    return this.graphqlService.findReviews();
  }

  public async removeOneReview(reviewId: string): Promise<ResponseOnUserPostRequest> {
    return await this.graphqlService.removeOneReview(reviewId);
  }
}