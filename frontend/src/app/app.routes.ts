import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { RegisterComponent } from './component/register/register.component';
import { authGuard } from './_guard/auth.guard';
import { authRedirectGuard } from './_guard/auth-redirect.guard';

export const routes: Routes = [
    {path:'dashboard', component:HomeComponent, canActivate:[authGuard]},
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    {path:'register', component:RegisterComponent, canActivate: [authRedirectGuard]},
    { path: '**', redirectTo: 'register' },
];
