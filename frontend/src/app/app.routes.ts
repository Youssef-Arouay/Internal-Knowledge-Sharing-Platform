import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { RegisterComponent } from './component/register/register.component';
import { authGuard } from './_guard/auth.guard';
import { authRedirectGuard } from './_guard/auth-redirect.guard';
import { PostCardComponent } from './component/tools/post-card/post-card.component';
import { SharePostComponent } from './component/tools/share-post/share-post.component';
import { ResetPasswordComponent } from './component/reset-password/reset-password.component';
import { ForumComponent } from './component/forum/forum.component';
import { ProfileComponent } from './component/profile/profile.component';
import { MyFilesComponent } from './component/my-files/my-files.component';
import { TagsInputComponent } from './component/tools/tags-input/tags-input.component';
import { DialogFormComponent } from './component/forum/dialog-form/dialog-form.component';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    
    {path:'dashboard', component:HomeComponent, canActivate:[authGuard]},
    {path:'profile', component:ProfileComponent, canActivate:[authGuard]},
    {path:'forum', component:ForumComponent, canActivate: [authGuard]},
    {path:'myfiles', component:MyFilesComponent, canActivate:[authGuard]},

    {path:'register', component:RegisterComponent, canActivate: [authRedirectGuard]},
    {path:'resetpassword', component:ResetPasswordComponent, canActivate: [authRedirectGuard]},

    {path:'postcard', component:PostCardComponent},
    {path:'sharepost', component:SharePostComponent},

    // {path:'test', component:DialogFormComponent},

    { path: '**', redirectTo: 'register' },


];
