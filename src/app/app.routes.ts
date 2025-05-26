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

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: MainPageComponent },
      {
        path: 'login',
        component: LoginPageComponent,
        canActivate: [noAuthGuard],
      },
      {
        path: 'registration',
        component: RegistrationPageComponent,
        canActivate: [noAuthGuard],
      },
      { path: 'catalog', component: CatalogProductPageComponent },
      { path: 'about', component: AboutUsPageComponent },
      { path: 'product', component: DetailedProductPageComponent },
      { path: '**', component: NotFoundPageComponent },
    ],
  },
];
