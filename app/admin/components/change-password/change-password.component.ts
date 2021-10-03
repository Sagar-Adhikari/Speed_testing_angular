import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LayoutService } from 'src/app/layout.service';
import { LoginService } from '../../services/login.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  @ViewChild('oldPassword', { static: true }) oldPassword: ElementRef;

  hideOldPassword = true;
  hideNewPassword = true;

  constructor(private layoutService: LayoutService,
    private loginService: LoginService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.changePasswordForm = new FormBuilder().group({
      oldPassword: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(15)])],
      newPassword: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(15)])]
    });
    this.layoutService.setLayout({ allowFooter: true, pageTitle: 'Change Password' });
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    if (valid) {
      this.loginService.changePassword(value.oldPassword, value.newPassword).subscribe(x => {
        if (x.success) {
          this.snackBar.open('Password changed successfully. Re-login with your new password.', null, { duration: 5000 });
          this.authService.clearToken();
          this.router.navigate(['admin/login']);
        } else {
          this.snackBar.open('Error! Current password does not match.', null, { duration: 2000 });
        }
      }, () => {
        this.snackBar.open('Error! Current password does not match.', null, { duration: 2000 });
      });
    } else {
      this.oldPassword.nativeElement.focus();
      this.snackBar.open('Error! Inputs are incorrect or invalid!', null, { duration: 1000 });
    }
  }
}
