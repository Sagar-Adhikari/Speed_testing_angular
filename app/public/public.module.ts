import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { InterceptorService } from './services/interceptor.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { ProgressBarModule } from 'angular-progress-bar';
import { GaugeComponent } from './components/gauge/gauge.component';
import { LitencyComponent } from './components/litency/litency.component';
import { DownloadComponent } from './components/download/download.component';
import { UploadComponent } from './components/upload/upload.component';
import { SpeedTestComponent } from './components/speed-test/speed-test.component';
import { environment } from 'src/environments/environment.prod';
import { BrowsingComponent } from './components/browsing/browsing.component';
import { MatButtonModule, MatMenuModule, MatRadioModule, MatCardModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { GaugesModule } from 'ng-canvas-gauges';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SafePipe } from './pipes/safe.pipe';

const config: SocketIoConfig = { url: environment.socketUrl, options: {} };

@NgModule({
  declarations: [GaugeComponent,
    LitencyComponent, DownloadComponent, UploadComponent, SpeedTestComponent,
    BrowsingComponent,
    SafePipe
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    SocketIoModule.forRoot(config),
    HttpClientModule,
    ProgressBarModule,
    GaugesModule,
    MatButtonModule, MatMenuModule, MatRadioModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatCardModule, MatInputModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true }],
  exports: [SpeedTestComponent]
})
export class PublicModule { }