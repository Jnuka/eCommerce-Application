import { Routes } from '@angular/router';
import { LayoutComponent } from './common-ui/layout/layout.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegistrationPageComponent } from './pages/registration-page/registration-page.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { CatalogProductPageComponent } from './pages/catalog-product-page/catalog-product-page.component';
import { AboutUsPageComponent } from './pages/about-us-page/about-us-page.component';
import { noAuthGuard } from './guards/no-auth.guard';
import { DetailedProductPageComponent } from './pages/detailed-product-page/detailed-product-page.component';
import { authOnlyGuard } from './guards/only-auth.guard';
import { UserProfileComponent } from './pages/user-profile/user-profile/user-profile.component';
import { ROUTES_PAGES } from './data/enums/routers';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: MainPageComponent },
      {
        path: ROUTES_PAGES.LOGIN,
        component: LoginPageComponent,
        canActivate: [noAuthGuard],
      },
      {
        path: ROUTES_PAGES.REGISTRATION,
        component: RegistrationPageComponent,
        canActivate: [noAuthGuard],
      },
      { path: ROUTES_PAGES.CATALOG, component: CatalogProductPageComponent },
      { path: ROUTES_PAGES.ABOUT, component: AboutUsPageComponent },
      { path: ROUTES_PAGES.PRODUCT, component: DetailedProductPageComponent },
      {
        path: ROUTES_PAGES.PROFILE,
        component: UserProfileComponent,
        canActivate: [authOnlyGuard],
      },
      { path: '**', component: NotFoundPageComponent },
    ],
  },
];
