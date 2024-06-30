import { Injectable } from "@nestjs/common";
import { ResponseOnUserPostRequest } from "apps/shared/models/users/user";
import { GraphqlService } from "../graphql/graphql.service";
import { Cost } from "apps/shared/models/costs/cost";

@Injectable()
export class CostsService {
  constructor(private readonly graphqlService: GraphqlService) { }
 
  public async insertOneCost(cost: Cost): Promise<ResponseOnUserPostRequest> {
    return this.graphqlService.insertOneCost(cost);
  }

  public async findCostsByTripId(tripId: string): Promise<Cost[]> {
    return this.graphqlService.findCostsByTripId(tripId);
  }
}