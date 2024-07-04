import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { RegisterComponent } from './component/register/register.component';
import { authGuard } from './_guard/auth.guard';
import { authRedirectGuard } from './_guard/auth-redirect.guard';
import { PostCardComponent } from './component/tools/post-card/post-card.component';
import { SharePostComponent } from './component/tools/share-post/share-post.component';
import { TestComponent } from './component/tools/test/test.component';
import { PostCommentComponent } from './component/tools/post-comment/post-comment.component';
import { PostComponent } from './component/tools/post/post.component';
import { TagsInputComponent } from './component/tools/tags-input/tags-input.component';
import { ResetPasswordComponent } from './component/reset-password/reset-password.component';
import { ForumComponent } from './component/forum/forum.component';
import { ForumNavBarComponent } from './component/layout/forum-nav-bar/forum-nav-bar.component';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    
    {path:'dashboard', component:HomeComponent, canActivate:[authGuard]},
    {path:'register', component:RegisterComponent, canActivate: [authRedirectGuard]},
    {path:'resetpassword', component:ResetPasswordComponent, canActivate: [authRedirectGuard]},
    {path:'forum', component:ForumComponent, canActivate: [authGuard]},

    {path:'postcard', component:PostCardComponent},
    {path:'sharepost', component:SharePostComponent},

    {path:'test', component:ForumNavBarComponent},

    { path: '**', redirectTo: 'register' },


];
