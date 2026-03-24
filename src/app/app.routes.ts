import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { Error404Component } from './error404/error404.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ContactComponent } from './contact/contact.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { CookiePolicyComponent } from './cookie-policy/cookie-policy.component';
import { TermsComponent } from './terms/terms.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { HotelsComponent } from './pages/hotels/hotels.component';
import { RestaurantsComponent } from './pages/restaurants/restaurants.component';
import { AttractionsComponent } from './pages/attractions/attractions.component';
import { ClubsComponent } from './pages/clubs/clubs.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AdminLayoutComponent } from './admin/admin-layout.component';
import { MainappLayoutComponent } from './mainapp-layout/mainapp-layout.component';
import { LandingLayoutComponent } from './landing-layout/landing-layout.component';
import { HomeappComponent } from './mainapp-layout/homeapp/homeapp.component';
import { adminGuard } from './guards/admin.guard';
import { authGuard } from './guards/auth.guard';
import { BusinessesComponent } from './admin/businesses/businesses.component';
import { UsersComponent } from './admin/users/users.component';
import { ReviewsComponent } from './admin/reviews/reviews.component';
import { CreateBusinessComponent } from './admin/create-business/create-business.component';
import { EditBusinessComponent } from './admin/edit-business/edit-business.component';
import { ProfileComponent } from './mainapp-layout/profile/profile.component';
import { BusinessDetailsComponent } from './mainapp-layout/business-details/business-details.component';
import { MyTripsComponent } from './mainapp-layout/my-trips/my-trips.component';
import { FavouritesComponent } from './mainapp-layout/favourites/favourites.component';
import { TripMakerComponent } from './trip-maker/trip-maker.component';
import { AiTripPlannerComponent } from './mainapp-layout/ai-trip-planner/ai-trip-planner.component';
import { TripDetailsComponent } from './mainapp-layout/trip-details/trip-details.component';

export const routes: Routes = [
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'businesses', component: BusinessesComponent },
      { path: 'businesses/create', component: CreateBusinessComponent },
      { path: 'businesses/edit/:id', component: EditBusinessComponent },
      { path: 'users', component: UsersComponent },
      { path: 'privacy-policy', component: PrivacyPolicyComponent },
      { path: 'terms', component: TermsComponent },
      { path: 'reviews', component: ReviewsComponent },
      { path: '404', component: Error404Component },
      { path: '**', redirectTo: '404' },
    ],
  },

  {
    path: 'mainapp',
    component: MainappLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'home', component: HomeappComponent, pathMatch: 'full' },
      { path: 'profile', component: ProfileComponent, pathMatch: 'full' },
      {
        path: 'business/:name',
        component: BusinessDetailsComponent,
        pathMatch: 'full',
      },
      {
        path: 'ai-planner',
        component: AiTripPlannerComponent,
        pathMatch: 'full',
      },
      {
        path: 'trip/:name',
        component: TripDetailsComponent,
        pathMatch: 'full',
      },
      { path: 'trip-maker', component: TripMakerComponent, pathMatch: 'full' },
      { path: 'my-trips', component: MyTripsComponent, pathMatch: 'full' },
      { path: 'favourites', component: FavouritesComponent, pathMatch: 'full' },
      {
        path: 'privacy-policy',
        component: PrivacyPolicyComponent,
        pathMatch: 'full',
      },
      { path: 'terms', component: TermsComponent, pathMatch: 'full' },
      { path: 'contact', component: ContactComponent, pathMatch: 'full' },
      { path: '404', component: Error404Component },
      { path: '**', redirectTo: '404' },
    ],
  },

  {
    path: '',
    component: LandingLayoutComponent,
    children: [
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'privacy-policy', component: PrivacyPolicyComponent },
      { path: 'cookie-policy', component: CookiePolicyComponent },
      { path: 'terms', component: TermsComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
      { path: 'hotels', component: HotelsComponent },
      { path: 'restaurants', component: RestaurantsComponent },
      { path: 'attractions', component: AttractionsComponent },
      { path: 'nightlife', component: ClubsComponent },
      { path: 'about', component: AboutComponent },
      { path: '404', component: Error404Component },
      { path: '**', redirectTo: '404' },
    ],
  },
];
