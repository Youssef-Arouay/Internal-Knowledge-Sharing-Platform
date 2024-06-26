import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export const authRedirectGuard: CanActivateFn = (route, state) => {


  let router = inject(Router);
  let toastr = inject(ToastrService);


  if (localStorage.getItem('token') && localStorage.getItem('user')) {
    // If user is authenticated, redirect to /dashboard
    toastr.warning("You are already connected !")
    router.navigateByUrl('/dashboard');
    return false; // Prevent access to the /register route
  } else {
    // Allow access to the /register route
    return true;
  }


}
