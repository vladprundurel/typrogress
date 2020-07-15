import { Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { SignUpComponent } from './user/sign-up/sign-up.component';
import { SignInComponent } from './user/sign-in/sign-in.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AuthGuard } from '../auth/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PersonaldataComponent } from './dashboard/personaldata/personaldata.component';
import { HomepageComponent } from './dashboard/homepage/homepage.component';
import { ProfileComponent } from './dashboard/profile/profile.component';
import { AddMealsComponent } from './dashboard/add-meals/add-meals.component';
import { AdminAddFoodInDbComponent } from './dashboard/admin-add-food-in-db/admin-add-food-in-db.component';
import { NutritionGoalsComponent } from './dashboard/nutrition-goals/nutrition-goals/nutrition-goals.component';
import { AdminAllUsersComponent } from './dashboard/admin-all-users/admin-all-users.component';
import { CustomDashboardComponent } from './dashboard/custom-dashboard/custom-dashboard.component';
import { AdminFoodRequestsComponent } from './dashboard/admin-food-requests/admin-food-requests/admin-food-requests.component';
import { CustomDashboardMeasurementsComponent } from './dashboard/custom-dashboard-measurements/custom-dashboard-measurements.component';

export const appRoutes: Routes = [
    {
        path: 'signup', component: UserComponent,
        children: [{ path: '', component: SignUpComponent }]
    },
    {
        path: 'login', component: UserComponent,
        children: [{ path: '', component: SignInComponent }]
    },
    {
        path: 'userprofile', component: UserProfileComponent, canActivate:[AuthGuard]
    },
    {
        path: '', redirectTo: '/login', pathMatch: 'full'
    },
    {
        path: 'dashboard', component: DashboardComponent, canActivate:[AuthGuard],
        children: [
            { path: '', component: HomepageComponent},
            { path: 'get-started', component: PersonaldataComponent},
            { path: 'profile', component: ProfileComponent},
            { path: 'addMeals', component: AddMealsComponent},
            { path: 'admin/addFood', component: AdminAddFoodInDbComponent},
            { path: 'nutrition-goals', component: NutritionGoalsComponent},
            { path: 'admin/users', component: AdminAllUsersComponent},
            { path: 'custom-dashboard', component: CustomDashboardComponent},
            { path: 'food-requests', component: AdminFoodRequestsComponent},
            { path: 'custom-dashboard-measurements', component: CustomDashboardMeasurementsComponent}
        ]
    }
];