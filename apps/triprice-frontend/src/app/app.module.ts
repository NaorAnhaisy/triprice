import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { StarRatingModule } from 'angular-star-rating';
import * as FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import * as FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FilePondModule, registerPlugin } from 'ngx-filepond';
import { NgxSpinnerModule } from 'ngx-spinner';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { PlaneLoadingComponent } from './components/plane-loading/plane-loading.component';
import { FilterFlightsPipe } from './components/Flights/filter-flights.pipe';
import { FlightCardComponent } from './components/Flights/flight-card/flight-card.component';
import { FlightDetailsComponent } from './components/Flights/flight-details/flight-details.component';
import { FlightOptionsComponent } from './components/Flights/flight-options/flight-options.component';
import { HotelCardComponent } from './components/Hotels/hotel-card/hotel-card.component';
import { HotelOptionsComponent } from './components/Hotels/hotel-options/hotel-options.component';
import { AddMembersComponent } from './components/add-members/add-members.component';
import { BlogComponent } from './components/blog/blog.component';
import { ChooseGroupComponent } from './components/choose-group/choose-group.component';
import { CreateGroupComponent } from './components/create-group/create-group.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { EditTripMembersComponent } from './components/edit-trip-members/edit-trip-members.component';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { JoinGroupComponent } from './components/join-group/join-group.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { MenuComponent } from './components/menu/menu.component';
import { ConfirmDialogComponent } from './components/my-trips/dialog/dialog-my-trips.component';
import { MyTripsComponent } from './components/my-trips/my-trips.component';
import { NewCostComponent } from './components/new-cost/new-cost.component';
import { NewReviewComponent } from './components/new-review/new-review.component';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';
import { PaymentsResultComponent } from './components/payment-transfers/payments-result.component';
import { PaymentsManagementComponent } from './components/payments-management/payments-management.component';
import { PlannedPricesComponent } from './components/planned-prices/planned-prices.component';
import { PriceCardComponent } from './components/price-card/price-card.component';
import { RegisterComponent } from './components/register/register.component';
import { ResultCardComponent } from './components/result-card/result-card.component';
import { SearchTripComponent } from './components/search-trip/search-trip.component';
import { StepperComponent } from './components/stepper/stepper.component';
import { TripPricesComponent } from './components/trip-prices/trip-prices.component';
import { TripTrackingComponent } from './components/trip-tracking/trip-tracking.component';
import { AirportService } from './services/airport.service';
import { AmadeusService } from './services/amadeus.service';
import { TripService } from './services/trip.service';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { HelpComponent } from './components/help/help.component';
registerPlugin(FilePondPluginFileValidateType, FilePondPluginImagePreview);

@NgModule({
  declarations: [
    AppComponent,
    FlightCardComponent,
    AddMembersComponent,
    FlightDetailsComponent,
    SearchTripComponent,
    HotelCardComponent,
    ResultCardComponent,
    PaymentsResultComponent,
    StepperComponent,
    PriceCardComponent,
    LogInComponent,
    ForgotPasswordComponent,
    RegisterComponent,
    FlightOptionsComponent,
    HotelOptionsComponent,
    OrderSummaryComponent,
    MenuComponent,
    MyTripsComponent,
    DialogComponent,
    PaymentsManagementComponent,
    BlogComponent,
    NewReviewComponent,
    ConfirmDialogComponent,
    EditTripMembersComponent,
    ChooseGroupComponent,
    JoinGroupComponent,
    CreateGroupComponent,
    NewCostComponent,
    TripPricesComponent,
    PlannedPricesComponent,
    FileUploaderComponent,
    TripTrackingComponent,
    FilterFlightsPipe,
    PlaneLoadingComponent,
    NotFoundComponent,
    HelpComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    CommonModule,
    MatTableModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatCheckboxModule,
    BrowserModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatListModule,
    MatStepperModule,
    MatChipsModule,
    NgxSpinnerModule.forRoot({ type: 'ball-scale-ripple-multiple' }),
    MatFormFieldModule,
    MatSelectModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatIconModule,
    RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' }),
    StarRatingModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatDividerModule,
    MatDialogModule,
    MatSnackBarModule,
    MatMenuModule,
    Ng2SearchPipeModule,
    FilePondModule,
    MatSliderModule,
    MatTooltipModule,
  ],
  providers: [
    AmadeusService,
    TripService,
    AirportService,
    DatePipe,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatDividerModule,
    MatDialogModule,
    MatSnackBarModule,
    MatMenuModule,
    MatIconModule,
    MatSliderModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
