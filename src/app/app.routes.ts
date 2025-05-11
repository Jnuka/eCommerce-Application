import { Routes } from '@angular/router';
import { LayoutComponent } from './common-ui/layout/layout.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegistrationPageComponent } from './pages/registration-page/registration-page.component';
import { MainPageComponent } from './pages/main-page/main-page.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: MainPageComponent },
      { path: 'login', component: LoginPageComponent },
      { path: 'registration', component: RegistrationPageComponent },
    ],
  },
];
