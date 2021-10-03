
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { map, catchError, last, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {
  @Output() private percentCompleted: EventEmitter<any> = new EventEmitter();
  private chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()_+`-=[]{}|;\':,./<>?';

  speed: number = 0;
  maxSpeed: number = 0;
  uploadDuration: number = 0;
  uploadUnit = '';

  private startTime: any;
  private currentTime: any;
  private previousTime: any;
  private byteReceived = 0;
  private byteReceivedOld = 0;
  public arr: any = [];

  private timeInterval = 15;
  private arrfileSize: any[] = [1024, 5120, 10240, 20480,40960]
  private fileIndex = 0;
  private loadedOld = 0;

  constructor(private http: HttpClient) { }

  public start() {
    this.startTime = undefined;
    this.currentTime = undefined;
    this.previousTime = undefined;
    this.speed = 0;
    this.byteReceived = 0;
    this.byteReceivedOld = 0
    this.arr = [];

    this.fileIndex = 0;
    this.maxSpeed = 0;
    this.loadedOld = 0;
    const data = this.generateTestData(this.arrfileSize[0]);
    this.upload(data).subscribe(x => {

    })
  }

  recurssiveUpload(index: number) {
    this.fileIndex = index + 1;
    const data = this.generateTestData(this.arrfileSize[this.fileIndex]);
    this.upload(data).subscribe(x => { });
  }

  private upload(data: any) {
    const header = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url: string = environment.api + 'upload/file';
    return this.http.post(url, data,
      { headers: header, reportProgress: true, observe: 'events' }).pipe(
        map(event => this.getEventMessage(event)),
        tap(message => this.showProgress(message)),
        last(),
        catchError(this.handleError())
      )
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
        return `upload started`;

      case HttpEventType.UploadProgress:
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
        let total: number = 0;
        let avgSpeed: number = 0;

        for (let i = 0; i < this.arr.length; i++) {
          total = total + this.arr[i].speed;
        }

        total = total + this.speed;
        avgSpeed = total / (this.arr.length + 1);

        this.speed = avgSpeed;
        if (avgSpeed > this.maxSpeed) {
          this.maxSpeed = avgSpeed;
        }
        this.arr.push({ duration, timePassed: this.previousTime - this.startTime, loaded: event.loaded - this.loadedOld, totalLoaded: event.loaded, percentDone, speed: nSpeed, avgSpeed });
        this.loadedOld = event.loaded;

        if (percentDone === 100) {
          this.speed = Math.floor(total / this.arr.length);
          this.maxSpeed = Math.floor(this.maxSpeed);
          this.uploadDuration = (this.currentTime - this.startTime) / 1000;
        }
        this.percentCompleted.emit({ percentDone: percentDone, speed: nSpeed, finished: false, fileStatus: this.arrfileSize[this.fileIndex] });
        return `${0}`;

      case HttpEventType.Response:
        if (this.uploadDuration > this.timeInterval || this.arrfileSize.length - 1 == this.fileIndex) {
          setTimeout(() => {
            this.percentCompleted.emit({ percentDone: 100, speed: this.speed, finished: true, fileStatus: this.arrfileSize[this.fileIndex], details: this.arr });
          }, 100)
          return ` ${0}`;
        } else {
          this.recurssiveUpload(this.fileIndex);
        }
      default:
        return `File surprising upload event: ${event.type.toString()}`;
    }
  }

  private showProgress(message: string) {
  }

  private handleError() {
    const userMessage = `upload failed.`;
    return (error: HttpErrorResponse) => {
      const message = error.error instanceof Error ?
        `${userMessage},  ${error.error.message}` :
        `${userMessage}, Server returned code ${error.status} with body '${error.error}'`;
      return of(message);
    }
  }

  generateTestData(sizeInKmb) {
    const iterations = (sizeInKmb * 1024);
    let result: string = '';
    for (let index = 0; index < iterations; index++) {
      result += this.chars.charAt(Math.floor(Math.random() * this.chars.length));
    }
    return result;
  }


}