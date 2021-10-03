import { Component, Output } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { EventEmitter } from '@angular/core';
@Component({
  selector: 'app-litency',
  templateUrl: './litency.component.html',
  styleUrls: ['./litency.component.scss']
})
export class LitencyComponent {
  @Output() private complete: EventEmitter<any> = new EventEmitter();

  private totalStep = 20;
  private flag = 0;
  private normal: any[] = [];
  private download: any[] = [];
  private upload: any[] = [];

  public avgPing = 0;
  private avgPingNormal = 0;
  private avgPingDownload = 0;
  private avgPingUpload = 0;

  public avgJitter = 0;
  private avgJitterNormal = 0;
  private avgJitterDownload = 0;
  private avgJitterUpload = 0;

  public gaugeAppend = '';
  private packetSent = 0;
  private packetFailed = 0;
  private packetLoss = 0;


  public getValue(): any {
    return {
      pingNormal: this.avgPingNormal,
      jitterNormal: this.avgJitterNormal,
      packetLoss: this.packetLoss,
      pingDownload: this.avgPingDownload,
      jitterDownload: this.avgJitterDownload,
      pingUpload: this.avgPingUpload,
      jitterUpload: this.avgJitterUpload,
      normalDetails: this.normal,
      downloadDetails: this.download,
      uploadDetails: this.upload
    }
  }

  public reset() {
    this.avgPing = undefined;
    this.avgJitter = undefined;
    this.avgPingNormal = undefined;
    this.avgJitterNormal = undefined;
    this.avgPingDownload = undefined;
    this.avgJitterDownload = undefined;
    this.avgPingUpload = undefined;
    this.avgJitterUpload = undefined;
    this.normal = [];
    this.download = [];
    this.upload = [];

  }
  constructor(private socket: Socket) {
    this.getTime();
  }

  public start(flag: number) {
    //flag=1 normal, flag=2 download, flag = 3 upload;
    this.flag = flag;
    if (this.flag === 1) {
      this.normal = [];
      this.download = [];
      this.upload = [];
    } else if (this.flag === 2) {
      this.download = [];
      this.upload = [];
    } else if (this.flag === 3) {
      this.upload = [];
    }

    let loop = 1;
    const interval = setInterval(() => {
      this.sendTime(loop);
      if (loop === this.totalStep) {
        clearInterval(interval);
      }
      loop++;
    }, 100);
  }


  private async storeLatency(totalTime: number, step: number) {
    if (this.flag === 1) {
      this.normal.push({ time: totalTime, step });
      this.getAveragePing(this.normal);
      this.getAverageJitter(this.normal);

    } else if (this.flag === 2) {
      this.download.push({ time: totalTime, step });
      this.getAveragePing(this.download);
      this.getAverageJitter(this.download);

    } else if (this.flag === 3) {
      this.upload.push({ time: totalTime, step });
      this.getAveragePing(this.upload);
      this.getAverageJitter(this.upload);
    }
  }

  private async getAveragePing(array: any[]) {
    let totalLatency = 0;
    for (let i = 0; i < array.length; i++) {
      totalLatency += array[i].time;
      this.avgPing = Math.floor(totalLatency / (i + 1));
      array[i] = { ...array[i], avgPing: this.avgPing };
      if (this.flag === 1) {
        this.avgPingNormal = this.avgPing;
      } else if (this.flag === 2) {
        this.avgPingDownload = this.avgPing;
      } else if (this.flag === 3) {
        this.avgPingUpload = this.avgPing;
      }
    }
  }

  private async getAverageJitter(array: any[]) {
    let totalJitter = 0;
    if (array.length === 1) {
      totalJitter = array[0].time;
    } else {
      for (let i = 0; i < array.length; i++) {
        if (i > 0) {
          totalJitter += Math.abs(array[i].avgPing - array[i - 1].avgPing);
          this.avgJitter = Math.round(totalJitter / i);
          array[i] = { ...array[i], avgJitter: this.avgJitter };
          if (this.flag === 1) {
            this.avgJitterNormal = this.avgJitter;
          } else if (this.flag === 2) {
            this.avgJitterDownload = this.avgJitter;
          } else if (this.flag === 3) {
            this.avgJitterUpload = this.avgJitter;
          }
        }
      }
    }

  }


  private getTime() {
    this.socket.on('getTime', msg => {
      msg = { ...msg, end: Date.now() };
      const time = msg.end - msg.start;

      if (time > 1000) {
        this.packetFailed += 1;
      }

      this.storeLatency(time, msg.step);
      if (msg.step === this.totalStep) {
        this.packetLoss = (this.packetFailed / this.packetSent) * 100;
        this.complete.emit(this.flag.toString());
      }
    })
  }

  private sendTime(step: number) {
    this.socket.emit('getTime', { start: Date.now(), step });
    this.packetSent += 1;
  }

}
