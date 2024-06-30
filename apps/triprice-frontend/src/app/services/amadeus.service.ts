import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { TripSearchResult }  from '../../../../shared/models/trips/tripSearchResult';
import { TripSearchRequestBody } from '../../../../shared/models/trips/tripsSearchRequestBody';
import { environment } from '../../environments/environment';
@Injectable({
    providedIn: 'root',
})
export class AmadeusService {
    constructor(protected httpClient: HttpClient) { }

    public async fetchTrips(body: TripSearchRequestBody): Promise<TripSearchResult> {
        console.log("Im about to send a requst")
        try {
            const trips = await firstValueFrom(this.httpClient.post<TripSearchResult>(environment.BACKEND_URL + '/amadeus/trips', body));
            return trips;
        } catch (error: any) {
            console.error("error while fetch trips:", error);
            return {
                flights: [],
                hotels: []
            };
        }
    }
}
