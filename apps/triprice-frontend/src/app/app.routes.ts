import { Route } from '@angular/router';
import { ResultCardComponent } from './components/result-card/result-card.component';
import { SearchTripComponent } from './components/search-trip/search-trip.component';
import { HotelOptionsComponent } from './components/Hotels/hotel-options/hotel-options.component';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';
import { AuthGuard } from './components/auth.guard';
import { LogInComponent } from './components/log-in/log-in.component';
import { RegisterComponent } from './components/register/register.component';
import { MyTripsComponent } from './components/my-trips/my-trips.component';
import { PaymentsManagementComponent } from './components/payments-management/payments-management.component';
import { BlogComponent } from './components/blog/blog.component';
import { FlightOptionsComponent } from './components/Flights/flight-options/flight-options.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { JoinGroupComponent } from './components/join-group/join-group.component';
import { TripTrackingComponent } from './components/trip-tracking/trip-tracking.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { HelpComponent } from './components/help/help.component';

export const appRoutes: Route[] = [
    { path: 'search', component: SearchTripComponent, canActivate: [AuthGuard] },
    { path: 'results', component: ResultCardComponent, canActivate: [AuthGuard] },
    { path: 'hotelOptions', component: HotelOptionsComponent, canActivate: [AuthGuard] },
    { path: 'flightOptions', component: FlightOptionsComponent, canActivate: [AuthGuard]},
    { path: 'summary', component: OrderSummaryComponent, canActivate: [AuthGuard] },
    { path: 'myTrips', component: MyTripsComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LogInComponent },
    { path: 'reset', component: ForgotPasswordComponent },
    { path: 'reset/:token', component: ForgotPasswordComponent },
    { path: 'joinGroup/:userId/:groupId', component: JoinGroupComponent },
    { path: 'login/success/:jwt', component: LogInComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'payments/:tripId/:user_id', component: PaymentsManagementComponent },
    { path: 'blog', component: BlogComponent, canActivate: [AuthGuard] },
    { path: 'traking/:tripId',  component: TripTrackingComponent},
    { path: 'help',  component: HelpComponent},
    { path: '',   redirectTo: '/search', pathMatch: 'full' },
    { path: '404', component: NotFoundComponent },
    { path: '**', redirectTo: '/404' }
];
