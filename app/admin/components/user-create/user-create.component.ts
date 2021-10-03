import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LayoutService } from 'src/app/layout.service';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent implements OnInit {
  @ViewChild('email', { static: true }) email: ElementRef;
  userId = undefined;
  addUserForm: FormGroup;
  hidePassword = true;
  roleList = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'User' }
  ];

  statusList = [
    { id: 1, name: 'Active' },
    { id: 0, name: 'Deactive' }
  ]

  constructor(private layoutService: LayoutService,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private router: Router) {
    this.layoutService.setLayout({ allowFooter: true, pageTitle: 'Create/Edit User' })
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.userId = params['id'] ? params['id'] : undefined;
      if (this.userId) {
        this.addUserForm = new FormBuilder().group({
          password: [''],
          email: [, Validators.compose([Validators.required, Validators.email])],
          roleId: ['', Validators.required],
          status: ['', Validators.required]
        });   
        this.userService.getUser(this.userId).subscribe((x: any): any=>{
          this.addUserForm.controls['email'].setValue(x.data[0].email);
          this.addUserForm.controls['roleId'].setValue(x.data[0].roleId);
          this.addUserForm.controls['status'].setValue(x.data[0].status);         
        });       
      } else {
        this.addUserForm = new FormBuilder().group({
          email: ['', Validators.compose([Validators.required, Validators.email])],
          password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(15)])],
          roleId: ['', Validators.required],
          status: ['', Validators.required]
        });
      }
      this.email.nativeElement.focus();
    });
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    if (valid) {
      if (!this.userId) {
        this.userService.addUser(value.email, value.password, value.roleId, value.status)
          .subscribe(x => {
            if (x.success) {
              this.snackBar.open('User created successfully!', null, { duration: 2000 });
            } else {
              this.snackBar.open('Error! Something bad happen.', null, { duration: 2000 });
            }
            this.router.navigate(['admin/users']);
          }, () => {
            this.snackBar.open('Error! Something bad happen.', null, { duration: 2000 });
          });

      } else {

        this.userService.editUser(this.userId, value.email, value.roleId, value.status)
          .subscribe(x => {
            if (x.success) {
              this.snackBar.open('User edited successfully!', null, { duration: 2000 });
            } else {
              this.snackBar.open('Error! Something bad happen.', null, { duration: 2000 });
            }
            this.router.navigate(['admin/users']);
          }, () => {
            this.snackBar.open('Error! Something bad happen.', null, { duration: 2000 });
          });
      }
    }
  }
}
