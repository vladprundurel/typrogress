//build-in
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from '@rinminase/ng-charts';
import { GaugeChartModule } from 'angular-gauge-chart';

//components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserComponent } from './user/user.component';
import { SignUpComponent } from './user/sign-up/sign-up.component';

//routes
import { appRoutes } from './routes';
import { SignInComponent } from './user/sign-in/sign-in.component';
import { UserService } from './shared/user.service';

//other
import { AuthGuard } from '../auth/auth.guard';
import { AuthInterceptor } from 'src/auth/auth.interceptor';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomepageComponent } from './dashboard/homepage/homepage.component';
import { PersonaldataComponent } from './dashboard/personaldata/personaldata.component';
import { ProfileComponent } from './dashboard/profile/profile.component';
import { AddMealsComponent } from './dashboard/add-meals/add-meals.component';
import { AdminAddFoodInDbComponent } from './dashboard/admin-add-food-in-db/admin-add-food-in-db.component';
import { NutritionGoalsComponent } from './dashboard/nutrition-goals/nutrition-goals/nutrition-goals.component';
import { AdminAllUsersComponent } from './dashboard/admin-all-users/admin-all-users.component';
import { CustomDashboardComponent } from './dashboard/custom-dashboard/custom-dashboard.component';
import { EditProfileComponent } from './dashboard/profile/edit-profile/edit-profile/edit-profile.component';
import { ActivityComponent } from './dashboard/profile/activity/activity/activity.component';
import { AdminFoodRequestsComponent } from './dashboard/admin-food-requests/admin-food-requests/admin-food-requests.component';
import { TabulatorTableComponent } from './dashboard/tabulator-tables/tabulator-tables.component';
import { CheckInComponent } from './dashboard/profile/check-in/check-in.component';
import { CustomDashboardMeasurementsComponent } from './dashboard/custom-dashboard-measurements/custom-dashboard-measurements.component';

@NgModule({
  declarations: [
    AppComponent,
    UserProfileComponent,
    UserComponent,
    SignUpComponent,
    SignInComponent,
    DashboardComponent,
    HomepageComponent,
    PersonaldataComponent,
    ProfileComponent,
    AddMealsComponent,
    AdminAddFoodInDbComponent,
    NutritionGoalsComponent,
    AdminAllUsersComponent,
    CustomDashboardComponent,
    EditProfileComponent,
    ActivityComponent,
    AdminFoodRequestsComponent,
    TabulatorTableComponent,
    CheckInComponent,
    CustomDashboardMeasurementsComponent
    // AddMealsModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    ChartsModule,
    GaugeChartModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, 
      useClass: AuthInterceptor, 
      multi: true
    }, 
    UserService, 
    AuthGuard,
  ],
  entryComponents: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
