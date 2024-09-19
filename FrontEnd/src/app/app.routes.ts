import { Routes } from '@angular/router';
import { SignupComponent } from './component/signup/signup.component';
import { LoginComponent } from './component/login/login.component';
import { UserListComponent } from './component/user-list/user-list.component';
import { authGuard } from './services/auth.guard';
import { logoutGuard } from './logout.guard';

export const routes: Routes = [
  { path: 'signup', component: SignupComponent,canActivate:[logoutGuard] },
  { path: 'login', component: LoginComponent ,canActivate:[logoutGuard]},
  // { path: 'users', component: UserListComponent },
  { path: '', redirectTo: '/signup', pathMatch: 'full' },
  {path:'users',component:UserListComponent ,canActivate:[authGuard]}
];
