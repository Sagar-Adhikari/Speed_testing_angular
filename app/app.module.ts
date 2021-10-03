import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PublicModule  } from './public/public.module';
import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatMenuModule, MatListModule, MatSnackBarModule } from '@angular/material';
// import { HTTP_INTERCEPTORS } from '@angular/common/http';
// import { InterceptorService } from './public/services/interceptor.service';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    PublicModule,
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatMenuModule,
    MatListModule,
    MatSnackBarModule
  ],
  providers: [],
  // { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true }
  bootstrap: [AppComponent]
})
export class AppModule { }
