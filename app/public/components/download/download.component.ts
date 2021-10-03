import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpRequest, HttpClient, HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError, map, tap, last } from 'rxjs/operators'

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})
export class DownloadComponent implements OnInit {
  @Output() private percentCompleted: EventEmitter<any> = new EventEmitter();

  majorTicks = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
  speed: number = 0;
  maxSpeed: number = 0;
  downloadDuration: number = 0;
  downloadUnit = '';

  private startTime: any;
  private currentTime: any;
  private previousTime: any;
  private byteReceived = 0;
  private byteReceivedOld = 0;
  public arr: any = [];
  private timeInterval = 5;
  private arrfileSize: any[] = ['128 Kb', '256 Kb', '512 Kb', '1 Mb', '2 Mb', '5 Mb', '10 Mb', '15 Mb', '20 Mb', '25 Mb', '30 Mb', '35 Mb'];
  private fileIndex = 0;
  private loadedOld = 0;
  private totalSpeed=0;

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  public start() {
    this.startTime = undefined;
    this.currentTime = undefined;
    this.previousTime = undefined;
    this.speed = 0;
    this.byteReceived = 0;
    this.byteReceivedOld = 0
    this.arr = [];
    this.downloadDuration = 0;
    this.fileIndex = 0;
    this.maxSpeed = 0;
    this.loadedOld = 0;
    this.totalSpeed =0;

    this.download(this.fileIndex).subscribe(x => { })


  }

  recurssiveDownload(index: number) {
    this.fileIndex = index + 1;
    this.download(this.fileIndex).subscribe(x => { });
  }

  private download(index: number) {
    this.totalSpeed=0;
    const url: string = environment.api + `download/file/${index}`;
    const req = new HttpRequest('GET', url, {
      reportProgress: true,
      responseType: 'blob'
    });

    return this.http.request(req).pipe(
      map(event => this.getEventMessage(event)),
      tap(message => this.showProgress(message)),
      last(),
      catchError(this.handleError())
    );
  }

  private getEventMessage(event: HttpEvent<any>) {
    switch (event.type) {
      case HttpEventType.Sent:
        this.startTime = Date.now();
        this.previousTime = this.startTime;
        this.byteReceivedOld = 0;
        this.speed = 0;
        this.arr = [];
        this.loadedOld = 0;
        this.percentCompleted.emit({ percentDone: 0, speed: 0, finished: false, fileStatus: this.arrfileSize[this.fileIndex] });
        return `download started`;

      case HttpEventType.DownloadProgress:
        const percentDone = Math.round((100 * event.loaded) / event.total);
        let nSpeed: number = 0;
        this.byteReceived = (8 * event.loaded) / 1000000;
        this.currentTime = Date.now();
        const duration = (this.currentTime - this.previousTime) / 1000;
        if (duration > 0) {
          nSpeed = (this.byteReceived - this.byteReceivedOld) / duration;
          this.speed = nSpeed
          this.previousTime = this.currentTime;
          this.byteReceivedOld = this.byteReceived;
        }
      //  let total: number = 0;
        let avgSpeed: number = 0;

        // for (let i = 0; i < this.arr.length; i++) {
        //   total = total + this.arr[i].speed;
        // }

        this.totalSpeed = this.totalSpeed + this.speed;
        avgSpeed = this.totalSpeed / (this.arr.length + 1);

        this.speed = avgSpeed;
        if (avgSpeed > this.maxSpeed) {
          this.maxSpeed = avgSpeed;
        }
        this.arr.push({ duration, timePassed: this.previousTime - this.startTime, loaded: event.loaded - this.loadedOld, totalLoaded: event.loaded, percentDone, speed: nSpeed, avgSpeed });
        this.loadedOld = event.loaded;

        if (percentDone === 100) {
          this.speed = Math.floor(this.totalSpeed / this.arr.length);
          this.maxSpeed = Math.floor(this.maxSpeed);
          this.downloadDuration = (this.currentTime - this.startTime) / 1000;
        }
        this.percentCompleted.emit({ percentDone: percentDone, speed: nSpeed, finished: false, fileStatus: this.arrfileSize[this.fileIndex] });
        return ` ${0}`;

      case HttpEventType.Response:
        if (this.downloadDuration > this.timeInterval || this.arrfileSize.length - 1 == this.fileIndex) {
          setTimeout(() => {
            this.percentCompleted.emit({ percentDone: 100, speed: this.speed, finished: true, fileStatus: this.arrfileSize[this.fileIndex], details: this.arr });
          }, 100)
          return ` ${0}`;
        } else {
          this.recurssiveDownload(this.fileIndex);
        }
      default:
        return `File surprising download event: ${event.type.toString()}`;
    }
  }

  private showProgress(message: string) {
  }
  private handleError() {
    const userMessage = `download failed.`;
    return (error: HttpErrorResponse) => {
      const message = error.error instanceof Error ?
        `${userMessage},  ${error.error.message}` :
        `${userMessage}, Server returned code ${error.status} with body '${error.error}'`;
      return of(message);
    }
  }
}