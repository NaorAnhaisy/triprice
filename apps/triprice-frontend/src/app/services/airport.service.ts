import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Airport } from "../../../../shared/models/airports/airport";
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AirportService {
    constructor(protected httpClient: HttpClient) { }
    fetchAirports(name: string): Observable<Airport[]> {
        return this.httpClient.get<Airport[]>(environment.BACKEND_URL + '/airport/name/' + name);
    }
}