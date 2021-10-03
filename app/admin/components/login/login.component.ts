import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { LayoutService } from 'src/app/layout.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  @ViewChild('userName', { static: true }) userEmail: ElementRef;

  currentURL: any = 'assets/nta-logo.png';
  hidePassword = true;
  constructor(private loginService: LoginService,
    private authService: AuthService,
    private layoutService: LayoutService,
    private router: Router,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.loginForm = new FormBuilder().group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(15)])]
    });
    this.layoutService.setLayout({ allowFooter: true, pageTitle: 'Login' });
    this.userEmail.nativeElement.focus();
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    if (valid) {
      this.loginService.login(value.email, value.password).subscribe(x => {
        if (x.success) {
          const y = x.data;
          this.authService.setToken(y.token, y.refreshToken, y.user);
          this.snackBar.open('Welcome to QOS Admin Site.',null,{duration:2000});
          this.router.navigate(['admin/test-count']);
        }
      }, () => {
        this.snackBar.open('Error! Username or password invalid.',null,{duration:2000});
      });
    } else {
      this.userEmail.nativeElement.focus();
      this.snackBar.open('Error! Inputs are incorrect or invalid!', null, { duration: 1000 });
    }
  }
}
