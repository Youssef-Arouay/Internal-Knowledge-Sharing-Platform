import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { RegisterComponent } from './component/register/register.component';
import { authGuard } from './_guard/auth.guard';
import { authRedirectGuard } from './_guard/auth-redirect.guard';
import { AddPostComponent } from './component/tools/add-post/add-post.component';
import { ReplyComponent } from './component/tools/reply/reply.component';

export const routes: Routes = [
    {path:'dashboard', component:HomeComponent, canActivate:[authGuard]},
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    {path:'register', component:RegisterComponent, canActivate: [authRedirectGuard]},


    {path:'addpost', component:AddPostComponent, canActivate:[authGuard]},
    {path:'reply', component:ReplyComponent},

    { path: '**', redirectTo: 'register' },


];
