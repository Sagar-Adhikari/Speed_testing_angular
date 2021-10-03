import { MatSnackBar } from '@angular/material';
import { AuthService } from './../admin/services/auth.service';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private router: Router, private authService: AuthService, private snackBar: MatSnackBar) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkedLoggedIn(state.url, route.data);
  }

  checkedLoggedIn(url: string, data: any): boolean {
    const user = this.authService.getCurrentUser();
    if (user) {

      const roleId = user.roleId;
      if (url === '/admin/login' || url === '/') {

        this.router.navigate(['/speed-test']);
        return false;
      }
      if (data.roleId.indexOf(roleId) >= 0) {
        return true;
      }
      this.snackBar.open('You Are Not Authorized To This Function.', undefined, { duration: 2000 });
      this.router.navigate(['/speed-test']);
      return false;
    } else {
      this.router.navigate(['/admin/login']);
      this.snackBar.open('Please Login', undefined, { duration: 2000 });
      return false;
    }
  }

  // 

}
