import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { ChartService } from './chart.service';
import { MatSnackBar } from '@angular/material';
import { LayoutService } from 'src/app/layout.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  fromDate = new Date(new Date().setMonth(new Date().getMonth() - 1));
  toDate = new Date();
  ispList: any[] = [];
  siteList: any[] = [{ location: 'Nepal' }, { location: 'Singapore' }];
  reportList: any[] = [{ report: 'Latency' }, { report: 'Speed' }, { report: 'Browsing' }];
  selectedReport: string = 'Latency';
  selectedSite: string = 'Nepal';
  locationList: any[] = [];
  selectedISP: string = '';
  selectedLocation: string = '';
  startRowNo: number = 0;
  limit: number = 10;
  loading = false;
  bandwidth = '';
  count: number = 100;

  public lineChartData: ChartDataSets[] = [
    { data: [], label: '' },

  ];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: (ChartOptions) = {
    responsive: true,
  };
  public lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];

  constructor(private chartService: ChartService, 
    private snackBar: MatSnackBar, private layoutService: LayoutService) {
    this.chartService.getISPList().subscribe(x => {
      this.locationList = [];
      const list = x.date;
      this.ispList = list.filter(function (obj: any) {
        return obj.internetServiceProvider !== '';
      });
    });
    this.layoutService.setLayout({pageTitle:'Test Speed', allowFooter: true})
  }

  displayReport() {
    if (!this.selectedReport || !this.selectedSite || !this.selectedISP) {
      return;
    }
    this.loading = true;
    if (this.selectedReport === 'Latency') {
      this.lineChartData = [
        { data: [], label: 'Latency' },
        { data: [], label: 'Jitter' },
        { data: [], label: 'Latency Download' },
        { data: [], label: 'Jitter Download' },
        { data: [], label: 'Latency Upload' },
        { data: [], label: 'Jitter Upload' }
      ];
      this.chartService.getLatencyOfISP(this.fromDate, this.toDate, this.selectedSite === 'Nepal' ? 0 : 1,
        this.selectedISP, this.startRowNo, this.limit, this.selectedLocation, +this.bandwidth).subscribe(x => {
          this.count = x.count.recordCount;
          const jitter = [];
          const latency = [];
          const downloadJitter = [];
          const downloadLatency = [];
          const uploadJitter = [];
          const uploadLatency = [];
          const label = [];
          for (let i = 0; i < x.data.length; i++) {
            jitter.push(x.data[i].averageJitter);
            latency.push(x.data[i].averageLatency);
            downloadLatency.push(x.data[i].loadedDownloadLatency);
            downloadJitter.push(x.data[i].loadedDownloadJitter)
            uploadLatency.push(x.data[i].loadedUploadLatency);
            uploadJitter.push(x.data[i].loadedUploadJitter)
            label.push(new Date(x.data[i].created_at).toLocaleDateString() + ' ' + new Date(x.data[i].created_at).toLocaleTimeString());
          };


          this.lineChartData = [
            { data: latency, label: 'Latency (ms)' },
            { data: jitter, label: 'Jitter (ms)' },
            { data: downloadLatency, label: 'Latency Download (ms)' },
            { data: downloadJitter, label: 'Jitter Download (ms)' },
            { data: uploadLatency, label: 'Latency Upload (ms)' },
            { data: uploadJitter, label: 'Jitter Upload (ms)' }
          ];
          this.lineChartLabels = label;
          this.loading = false;
        }, () => {
          this.loading = false;
          this.snackBar.open('Server Error!', undefined, {
            duration: 2000,
          });
        });
    } else if (this.selectedReport === "Speed") {
      this.lineChartData = [
        { data: [], label: 'Downlaod' },
        { data: [], label: 'Upload' },
        { data: [], label: 'Max Download' },
        { data: [], label: 'Max Upload' },
      ];
      this.chartService.getSpeedOfISP(this.fromDate, this.toDate, this.selectedSite === 'Nepal' ? 0 : 1,
        this.selectedISP, this.startRowNo, this.limit, this.selectedLocation, +this.bandwidth).subscribe(x => {
          this.count = x.count.recordCount;
          const avgDownload = [];
          const avgUpload = [];
          const maxDownload = [];
          const maxUpload = [];
          const label = [];
          for (let i = 0; i < x.data.length; i++) {
            avgDownload.push(x.data[i].averageDownloadRate);
            avgUpload.push(x.data[i].averageUploadRate);
            maxDownload.push(x.data[i].maximumDownloadRate);
            maxUpload.push(x.data[i].maximumUploadRate)
            label.push(new Date(x.data[i].created_at).toLocaleDateString() + ' ' + new Date(x.data[i].created_at).toLocaleTimeString());
          };
          this.lineChartData = [
            { data: avgDownload, label: 'Downlaod (Mbps)' },
            { data: avgUpload, label: 'Upload (Mbps)' },
            { data: maxDownload, label: 'Max Download (Mbps)' },
            { data: maxUpload, label: 'Max Upload (Mbps)' },
          ];
          this.lineChartLabels = label;
          this.loading = false;
        }, () => {
          this.loading = false;
          this.snackBar.open('Server Error!', undefined, {
            duration: 2000,
          });
        });
    } else if (this.selectedReport === "Browsing") {
      this.lineChartData = [
        { data: [], label: 'Browsing' }
      ];
      this.chartService.getBrowsingOfISP(this.fromDate, this.toDate, this.selectedSite === 'Nepal' ? 0 : 1,
        this.selectedISP, this.startRowNo, this.limit, this.selectedLocation, +this.bandwidth).subscribe(x => {
          this.count = x.count.recordCount;
          const browsing = [];
          const label = [];
          for (let i = 0; i < x.data.length; i++) {
            browsing.push(x.data[i].browsingDelay);
            label.push(new Date(x.data[i].created_at).toLocaleDateString() + ' ' + new Date(x.data[i].created_at).toLocaleTimeString());
          };
          this.lineChartData = [
            { data: browsing, label: 'Browsing Delay (ms)' },
          ];
          this.lineChartLabels = label;
          this.loading = false;
        }, () => {
          this.loading = false;
          this.snackBar.open('Server Error!', undefined, {
            duration: 2000,
          });
        });
    }

  }


  ngOnInit() {
  }

  itemChange($event: any, flag: string) {
    if ($event.isUserInput) {
      this.startRowNo = 0;
      this.selectedLocation = '';
      if (flag === 'report') {
        this.selectedReport = $event.source.value;
      } else if (flag === "site") {
        this.selectedSite = $event.source.value;
      } else if (flag === 'isp') {
        this.selectedISP = $event.source.value;
        this.chartService.getLocationList(this.selectedISP).subscribe(x => {
          this.locationList = x.date;
        });
      } else if (flag === "location") {
        this.selectedLocation = $event.source.value;
      }
      this.displayReport();
    }
  }

  dateChange(value: string, flag: string) {
    this.startRowNo = 0;
    this.displayReport();
  }

  sliderOnChange(value: number, flag: string) {

    setTimeout(() => {
      this.displayReport();
    }, 100);
  
  }

  bandwidthChanged($event: any) {
    this.startRowNo = 0;
    this.displayReport()
  }
}
