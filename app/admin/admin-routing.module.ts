import { ClearRecordsComponent } from './components/clear-records/clear-records.component';
import { AuthGuardService } from './../auth-guard/auth-guard.service';
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from './components/login/login.component';
import { NgModule } from '@angular/core';
import { TableComponent } from './components/table/table.component';
import { ChartComponent } from './components/chart/chart.component';
import { TestCountComponent } from './components/test-count/test-count.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { UserComponent } from './components/user/user.component';
import { UserCreateComponent } from './components/user-create/user-create.component';

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    {
        path: 'table', component: TableComponent,
        canActivate: [AuthGuardService],
        data: { roleId: '1.2.' }
    },
    {
        path: 'chart', component: ChartComponent,
        canActivate: [AuthGuardService],
        data: { roleId: '1.2.' }
    },
    {
        path: 'test-count', component: TestCountComponent,
        canActivate: [AuthGuardService],
        data: { roleId: '1.2.' }
    },
    {
        path: 'change-password', component: ChangePasswordComponent,
        canActivate: [AuthGuardService],
        data: { roleId: '1.2.' }
    },
    {
        path: 'users', component: UserComponent,
        canActivate: [AuthGuardService],
        data: { roleId: '1.' }
    },
    {
        path: 'add-user/:id', component: UserCreateComponent,
        canActivate: [AuthGuardService],
        data: { roleId: '1.' }
    },
    { path: '', component: TestCountComponent, },

    {
        path: 'clear', component: ClearRecordsComponent,
        canActivate: [AuthGuardService],
        data: { roleId: '1.' }
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { };