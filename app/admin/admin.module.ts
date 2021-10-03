import { ClearRecordsComponent } from './components/clear-records/clear-records.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { AdminRoutingModule } from './admin-routing.module';
import { ChartComponent } from './components/chart/chart.component';
import { ChartsModule } from 'ng2-charts';
import {
  MatFormFieldModule, MatInputModule, MatNativeDateModule,
  MatDatepickerModule, MatSelectModule, MatButtonModule, MatProgressBarModule,
  MatSliderModule, MatSnackBarModule, MatTableModule, MatSortModule, MatPaginatorModule,
  MatIconModule, MatListModule, MatMenuModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TestCountComponent } from './components/test-count/test-count.component';
import { TableComponent } from './components/table/table.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { UserComponent } from './components/user/user.component';
import { UserCreateComponent } from './components/user-create/user-create.component';

@NgModule({
  declarations: [
    LoginComponent,
    ChartComponent,
    TestCountComponent,
    TableComponent,
    ChangePasswordComponent,
    UserComponent,
    UserCreateComponent,
    ClearRecordsComponent
  ],
  imports: [
    CommonModule,
    ChartsModule,
    AdminRoutingModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonModule,
    MatSliderModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatSnackBarModule,
    MatTableModule
  ],
  providers: [MatDatepickerModule]
})
export class AdminModule { }
