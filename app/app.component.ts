import { Component } from '@angular/core';
import { LayoutService } from './layout.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { AuthService } from './admin/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private _roleId: number = 0;
  private _email: string = 'iuiuiui';
  title = 'nta-client';
  pageTitle = 'Initial Title';
  allowFooter = true;
  smallScreen = false;
  isLoggedIn = false;

  get roleId(): number {
    return this._roleId;
  }
  get email(): string {
    return this._email;
  }

  constructor(private layoutService: LayoutService,
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private router: Router) {
    this.layoutService.pageTitle$.subscribe(x => {
      this.pageTitle = x.pageTitle;
      this.allowFooter = x.allowFooter;
    });

    this.authService.currentUser$.subscribe(x => {
      if (x) {
        this.isLoggedIn = true;
        this._roleId = x.roleId;
        this._email = x.email;
      } else {
        this._roleId = 0;
        this._email = '';
        this.isLoggedIn = false;
      }
    });


    this.breakpointObserver.observe([
      '(max-width: 768px)'
    ]).subscribe(result => {
      if (result.matches) {
        this.smallScreen = true;
      } else {
        this.smallScreen = false;
      }
    });
    this.authService.changeUser();
  }

  login() {
    this.router.navigate(['admin/login']);
  }
  logout() {
    this.authService.clearToken();
    this.router.navigate(['speed-test']);
  }
  changePassword() {
    this.router.navigate(['admin/change-password'])
  }
}
