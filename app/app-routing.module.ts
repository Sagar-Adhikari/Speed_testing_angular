import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SpeedTestComponent } from './public/components/speed-test/speed-test.component';

const routes: Routes = [
  { path: 'public', loadChildren:'./public/public.module#PublicModule' },
  { path: 'admin', loadChildren: './admin/admin.module#AdminModule' },
  { path: 'speed-test', component: SpeedTestComponent },
  { path: '', component: SpeedTestComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
