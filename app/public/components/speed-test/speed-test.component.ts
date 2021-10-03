import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { LitencyComponent } from '../litency/litency.component';
import { HttpClient } from '@angular/common/http';
import { DownloadComponent } from '../download/download.component';
import { UploadComponent } from '../upload/upload.component';
import { BrowsingComponent } from '../browsing/browsing.component';
import { SpeedTestService } from '../../services/speed-test.service';
import { IComplain } from 'src/app/interfaces/complain';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { LayoutService } from 'src/app/layout.service';

interface IIspInfo {
  isp: string;
  ip: string;
  city: string;
  countryCode: string;
  country: string;
  lat: number;
  lng: number;
}

@Component({
 // changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-speed-test',
  templateUrl: './speed-test.component.html',
  animations: [
    trigger(
      'enterAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('500ms', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0)', opacity: 1 }),
        animate('500ms', style({ transform: 'translateY(100%)', opacity: 0 }))
      ])
    ]
    ),
    trigger('fadeInOut', [
      transition(':enter', [   // :enter is alias to 'void => *'
        style({ opacity: 0 }),
        animate(500, style({ opacity: 1 }))
      ]),
      transition(':leave', [   // :leave is alias to '* => void'
        animate(500, style({ opacity: 0 }))
      ])
    ])
  ],
  styleUrls: ['./speed-test.component.scss']
})

export class SpeedTestComponent implements OnInit {
  @ViewChild('latency', { static: true }) public latency: LitencyComponent;
  @ViewChild('download', { static: true }) public download: DownloadComponent;
  @ViewChild('upload', { static: true }) public upload: UploadComponent;
  @ViewChild('browsing', { static: true }) public browsing: BrowsingComponent;
  @ViewChild('name', { static: false }) private name: ElementRef;

  downloadArray: any;
  uploadArray: any;
  showDownloadDetail: boolean = false;
  showUploadDetail: boolean = false;
  isLoggedIn = localStorage.getItem('ni-user') ? true : false;

  checking = false;
  completed = false;
  currentAction = '';
  complaining = false;
  complainCompleted = false;
  cancelled = false;
  percent = 0;
  selectedServer = "Nepal";
  servers: string[] = ['Nepal', 'Singapore'];
  ispInfo: IIspInfo = { city: '', country: '', countryCode: '', isp: '', ip: '', lat: 0, lng: 0 };
  dataPing: any;
  message = `If you are not satisfied with internet speed please click on Complain button.  Fill out the form 
   and click Send button to send this test result to NTA for further action.`


  complainForm = new FormGroup({
    name: new FormControl('', Validators.compose([Validators.maxLength(50), Validators.minLength(1), Validators.required])),
    email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
    bandwidth: new FormControl('', Validators.compose([Validators.min(5), Validators.max(100), Validators.required])),
    mobileNo: new FormControl('', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)]))
  });

  constructor(private http: HttpClient,
    private speedTestService: SpeedTestService,
    private layoutService: LayoutService,
  ) {
    this.layoutService.setLayout({ pageTitle: 'NTA QOS App', allowFooter: true });

  }

  ngOnInit() {
    this.getIp(x => {
      //https://ipapi.com/json
      this.ispInfo.city = x.city;
      this.ispInfo.country = x.country;
      this.ispInfo.countryCode = x.country_code;
      this.ispInfo.ip = x.ip;
      this.ispInfo.isp = x.org;
      this.ispInfo.lat = x.latitude;
      this.ispInfo.lng = x.longitude;

      //http://ip-api.com/json
      // this.ispInfo.city = x.city;
      // this.ispInfo.country = x.country;
      // this.ispInfo.countryCode = x.countryCode;
      // this.ispInfo.ip = x.query;
      // this.ispInfo.isp = x.isp;
      // this.ispInfo.lat = x.lat;
      // this.ispInfo.lng = x.lon;
    });

    this.dataPing = this.latency.getValue();

  }

  private clearResult() {
    this.latency.reset();
    this.complaining = false;
    this.completed = false;
    this.checking = false;
    this.complainCompleted = false;
    // this.dataPing = this.latency.getValue();
    this.cancelled = false;
  }
  startCheck() {
    // this.download.speed = this.download.speed + 1;
    if (!this.checking) {
      this.clearResult();
      this.completed = false;
      this.checking = true;

      this.downloadArray = null;
      this.uploadArray = null;
      this.latency.start(1);
    } else {
      window.stop();
      this.clearResult();
      this.cancelled = true;
      this.currentAction = "Test Cancelled"
    }
  }

  latencyJitterCompleted($event: any) {
    //finished checking latency and jitter
    if ($event.toString() === "1" && !this.cancelled) {
      this.dataPing = this.latency.getValue();
      this.download.start();
      this.currentAction = 'Downloading...';
    }
  }

  downloadPercentCompleted($event: any) {
    if ($event.percentDone === 0 && $event.speed === 0 && $event.finished === false && !this.cancelled) {
      //download started check latency and jitter on download
      this.latency.start(2);
    }
    this.percent = $event.percentDone;
    this.currentAction = `Downloading ${$event.fileStatus}...`;

    if ($event.finished === true && !this.cancelled) {
      this.downloadArray = this.download.arr;

      //download finished now check upload
      this.currentAction = 'Uploading...';
      this.dataPing = this.latency.getValue();
      this.upload.start();
    }
    if ($event.finished === true) {
    }
  }

  uploadPercentCompleted($event: any) {
    if ($event.percentDone === 0 && $event.speed === 0 && $event.finished === false && !this.cancelled) {
      //upload started check latency and jitter on upload
      this.latency.start(3);
    }
    this.percent = $event.percentDone;
    this.currentAction = `Uploading ${$event.fileStatus / 1024}Mb...`;
    if ($event.finished === true && !this.cancelled) {
      //upload finished not check browsing delay
      this.dataPing = this.latency.getValue();
      this.browsing.start();
    }
    if ($event.finished === true) {
    }
  }

  browsingTestCompleted() {
    this.checking = false;
    this.completed = true;
    this.showDownloadDetail = true;
    this.showUploadDetail = true;
    this.uploadArray = this.upload.arr;

    this.currentAction = 'Testing Completed';
  }

  private getIp(callback: (data: any) => void) {
    this.http
      .get('https://ipapi.co/json/')
      .subscribe(data => callback(data));
  }

  doComplain() {
    this.complaining = true;
    setTimeout(() => {
      this.name.nativeElement.focus();
    }, 0);
  }

  onSubmit({ valid, value }) {
    if (!valid) {
      return;
    }
    const lj = this.latency.getValue();
    const complain: IComplain = {
      site: 0,
      averageLatency: lj.pingNormal,
      averageJitter: lj.jitterNormal,
      packetLoss: lj.packetLoss,
      maximumDownloadRate: this.download.maxSpeed,
      averageDownloadRate: this.download.speed,
      loadedDownloadLatency: lj.pingDownload,
      loadedDownloadJitter: lj.jitterDownload,
      dataDownloadSuccessRate: this.download.downloadDuration,
      maximumUploadRate: this.upload.maxSpeed,
      averageUploadRate: this.upload.speed,
      loadedUploadLatency: lj.pingUpload,
      loadedUploadJitter: lj.jitterUpload,
      dataUploadSuccessRate: this.upload.uploadDuration,
      browsingDelay: this.browsing.browsingDelay,
      browsingSuccessRate: 0,
      internetServiceProvider: this.ispInfo.isp,
      location: this.ispInfo.city,
      lat: this.ispInfo.lat === null ? 0 : this.ispInfo.lat,
      lng: this.ispInfo.lng === null ? 0 : this.ispInfo.lng,
      clientName: value.name,
      bandWidth: +value.bandwidth,
      mobileNo: value.mobileNo,
      email: value.email
    }

    this.speedTestService.doComplain(complain).subscribe(x => {
      this.complainCompleted = true;
      this.complaining = false;
      this.complainForm.reset();
    })
  }
  showDownloadDetails() {
    this.showDownloadDetail = !this.showDownloadDetail;
    this.showDownloadDetail ?this.showUploadDetail=true : this.showUploadDetail=true;
  }

  showUploadDetails() {
    this.showUploadDetail = !this.showUploadDetail;
    this.showUploadDetail ? this.showDownloadDetail=true:this.showDownloadDetail=true;
  }
}