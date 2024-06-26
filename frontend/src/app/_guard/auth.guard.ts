import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {
  
  let router=inject(Router);
  let toastr=inject(ToastrService);

  let token = localStorage.getItem('token');
  let user = localStorage.getItem('user');


  if (token !== null && token !== '' 
     && user !== null && user !== '') {  

    return true;

  } else {

    toastr.warning("Unauthorized access ! Login please")
    router.navigateByUrl('/register') 
    return false ;
    
  }

};
