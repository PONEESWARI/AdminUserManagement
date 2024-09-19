import { CanActivateFn } from '@angular/router';

export const logoutGuard: CanActivateFn = (route, state) => {
  if(localStorage.getItem('token')){
    localStorage.removeItem('token');
  }
  return true;
};
