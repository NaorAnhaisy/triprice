import { Injectable } from "@nestjs/common";
import { ResponseOnUserPostRequest } from "apps/shared/models/users/user";
import { GraphqlService } from "../graphql/graphql.service";
import { PlannedPrice } from "apps/shared/models/plannedPrices/plannedPrice";

@Injectable()
export class PlannedPricesService {
  constructor(private readonly graphqlService: GraphqlService) { }

  public async insertOnePlannedPrice(plannedPrice: PlannedPrice): Promise<ResponseOnUserPostRequest> {
    return this.graphqlService.insertOnePlannedPrice(plannedPrice);
  }

  public async findPlannedPricesByTripId(tripId: string): Promise<PlannedPrice[]> {
    return this.graphqlService.findPlannedPricesByTripId(tripId);
  }

  public async insertPlannedPrices(plannedPrices: PlannedPrice[]): Promise<ResponseOnUserPostRequest> {
    return this.graphqlService.insertPlannedPrices(plannedPrices);
  }

  public async updatePlannedPrices(plannedPrices: PlannedPrice[]): Promise<ResponseOnUserPostRequest> {
    
    return this.graphqlService.updatePlannedPrices(plannedPrices);
  }
}