
import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartService } from '../chart/chart.service';
import { MatPaginator, MatSort, MatSnackBar } from '@angular/material';
import { merge } from 'rxjs';
import { tap, timeout } from 'rxjs/operators';
import { LayoutService } from 'src/app/layout.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  fromDate = new Date(new Date().setMonth(new Date().getMonth() - 1));
  toDate = new Date();
  ispList: any[] = [];
  siteList: any[] = [{ location: 'All' }, { location: 'Nepal' }, { location: 'Singapore' }];
  selectedSite: string = '';
  locationList: any[] = [];
  selectedISP: string = '';
  selectedLocation: string = '';
  loading = false;
  bandwidth = '';

  dataSource = [];
  length = 0;

  private sortDirection: any;
  private sortField: any;

  public result;

  displayColumns = ['created_at', 'isp', 'bandWidth', 'location',
    'clientName', 'email', 'mobileNo',
    'averageLatency', 'averageJitter', 'packetLoss',
    'maximumDownloadRate', 'averageDownloadRate', 'loadedDownloadLatency', 'loadedDownloadJitter', 'dataDownloadSuccessRate',
    'maximumUploadRate', 'averageUploadRate', 'loadedUploadLatency', 'loadedUploadJitter', 'dataUploadSuccessRate',
    'browsingDelay'];

  ngOnInit() {
    this.paginator.showFirstLastButtons = true;
    this.paginator.pageSizeOptions = [5, 10, 25, 50, 100, 200, 300, 400, 500];
    this.paginator.pageSize = 50;
    this.loadData(this.paginator.pageIndex, this.paginator.pageSize);
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe((x: { active: any; direction: string }) => {
      this.paginator.pageIndex = 0;
      this.sortField = x.active;
      this.sortDirection = x.direction === "asc" ? 'ASC' : x.direction === "desc" ? "DESC" : undefined;
    });

    merge(this.sort.sortChange, this.paginator.page).pipe(
      tap(() => this.loadData(this.paginator.pageIndex, this.paginator.pageSize))
    ).subscribe();
  }

  constructor(private chartService: ChartService,
    private snackBar: MatSnackBar, private layoutService: LayoutService) {
    this.layoutService.setLayout({ pageTitle: 'Complain Listing...', allowFooter: false });
    this.chartService.getISPList().subscribe(x => {
      this.locationList = [];
      const list = x.date;
      list.unshift({ internetServiceProvider: "All" });
      this.ispList = list.filter(function (obj: any) {
        return obj.internetServiceProvider !== '';
      });
    })
  }

  itemChange($event: any, flag: string) {
    if ($event.isUserInput) {
      this.selectedLocation = '';
      if (flag === "site") {
        this.selectedSite = $event.source.value;
      } else if (flag === 'isp') {
        this.selectedISP = $event.source.value;
        this.chartService.getLocationList(this.selectedISP).subscribe(x => {
          this.locationList = x.date;
        });
      } else if (flag === "location") {
        this.selectedLocation = $event.source.value;
      }
      this.paginator.pageIndex = 0;
      this.loadData(this.paginator.pageIndex, this.paginator.pageSize);
    }
  }


  formatDate(x: any): string {
    const d = new Date(x).toLocaleDateString();
    const t = new Date(x).toLocaleTimeString();
    return `${d} ${t}`
  }

  dateChange(value: string, flag: string) {
    this.paginator.pageIndex = 0;
    this.loadData(this.paginator.pageIndex, this.paginator.pageSize);
  }

  loadData(pageNo: number, pageSize: number, forExport: boolean = false) {
    if (!this.selectedSite || !this.selectedISP) {
      return;
    }
    this.loading = true;
    this.chartService.getComplains(this.fromDate, this.toDate, this.selectedSite === 'Nepal' ? 0 : this.selectedSite === 'Singapore' ? 1 : -1,
      this.selectedISP.toLowerCase(), this.selectedLocation, +this.bandwidth, pageNo, pageSize,
      this.sortField, this.sortDirection).subscribe(x => {
        this.length = x.count.recordCount;
        x.data.forEach((element:
          {
            created_at: any,
            averageLatency: any,
            averageJitter: any,
            packetLoss: any,
            maximumDownloadRate: any,
            averageDownloadRate: any,
            loadedDownloadLatency: any,
            loadedDownloadJitter: any,
            dataDownloadSuccessRate: any;

            maximumUploadRate: any,
            averageUploadRate: any,
            loadedUploadLatency: any,
            loadedUploadJitter: any,
            dataUploadSuccessRate: any;

            browsingDelay: any

          }) => {
          element.created_at = this.formatDate(element.created_at);
          var l = +element.averageLatency;
          element.averageLatency = `${l.toFixed(0)}`;
          l = +element.averageJitter;
          element.averageJitter = `${l.toFixed(0)}`;
          l = +element.packetLoss;
          element.packetLoss = `${l.toFixed(0)} %`;


          l = +element.maximumDownloadRate;
          element.maximumDownloadRate = `${l.toFixed(0)}`;
          l = +element.averageDownloadRate;
          element.averageDownloadRate = `${l.toFixed(0)}`;
          l = +element.loadedDownloadLatency;
          element.loadedDownloadLatency = `${l.toFixed(0)}`;
          l = +element.loadedDownloadJitter;
          element.loadedDownloadJitter = `${l.toFixed(0)}`;
          l = +element.dataDownloadSuccessRate;
          element.dataDownloadSuccessRate = `${l.toFixed(1)}`;


          l = +element.maximumUploadRate;
          element.maximumUploadRate = `${l.toFixed(0)}`;
          l = +element.averageUploadRate;
          element.averageUploadRate = `${l.toFixed(0)}`;
          l = +element.loadedUploadLatency;
          element.loadedUploadLatency = `${l.toFixed(0)}`;
          l = +element.loadedUploadJitter;
          element.loadedUploadJitter = `${l.toFixed(0)}`;
          l = +element.dataUploadSuccessRate;
          element.dataUploadSuccessRate = `${l.toFixed(1)}`;

          l = +element.browsingDelay;
          element.browsingDelay = `${l.toFixed(0)}`;
        });
        //  x.data.length>0?this.disabled=false:this.disabled=true;
        if (!forExport) {
          this.dataSource = x.data;
        }
        else {
          this.exportRecord(x.data);
        }
        this.loading = false;
      }, () => {
        this.loading = false;
        this.snackBar.open('Server Error!', undefined, {
          duration: 2000,
        });
      });
  }

  bandwidthChanged($event: any) {
    this.paginator.pageIndex = 0;
    this.loadData(this.paginator.pageIndex, this.paginator.pageSize);
  }


  exportRecord(data: any, pageNo: number = 0) {
    if (!data) {
      this.loadData(0, 999999999, true);
    } else {
      if (data.length === 0) {
        this.snackBar.open('Record not found', undefined, {
          duration: 2000,
        });
        return;
      }
      const pageTitle = `Site: ${this.selectedSite}
      ISP:  ${this.selectedISP}
      From ${this.formatDate(this.fromDate)} 
      To  ${ this.formatDate(this.toDate)} 
      ${this.selectedLocation != '' ? 'Location: ' + this.selectedLocation : ''}
      ${this.bandwidth != '' ? 'Bandwidth: ' + this.bandwidth : ''}
      ${pageNo > 0 ? 'Page No:' + pageNo.toString() : ''}`;
      const exportData: any[] = [...data];
      exportData.unshift({ isp: "ISP", location: "Location", created_at: 'Created At', averageLatency: "Average Latency", averageJitter: "Average Jitter", packetLoss: "Packet Loss", maximumDownloadRate: "Maximum Download Rate", averageDownloadRate: "Average Download Rate", loadedDownloadLatency: 'Loaded Download Latency', loadedDownloadJitter: "Loaded Download Jitter", dataDownloadSuccessRate: "Download Duration", maximumUploadRate: "Maximum Upload Rate", averageUploadRate: "Average Upload Rate", loadedUploadLatency: "Loaded Upload Latency", loadedUploadJitter: "Loaded Upload Jitter", dataUploadSuccessRate: "Upload Duration", browsingDelay: 'Browsing Delay', lat: "Latitude", lng: "Longitude", clientName: 'Client Name', bandWidth: "BandWidth", mobileNo: "Mobile No", email: "Email" });
      exportData.unshift({ isp: pageTitle });
      exportData.unshift({ isp: `NTA Test List` });
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData, { header: ["isp", "location", "created_at", "averageLatency", "averageJitter", "packetLoss", "maximumDownloadRate", "averageDownloadRate", "loadedDownloadLatency", "loadedDownloadJitter", "dataDownloadSuccessRate", "maximumUploadRate", "averageUploadRate", "loadedUploadLatency", "loadedUploadJitter", "dataUploadSuccessRate", "browsingDelay", "lat", "lng", "clientName", "bandWidth", "mobileNo", "email"], skipHeader: true });
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, 'TestList.xlsx');
      this.snackBar.open('Export Completed.', undefined, {
        duration: 2000,
      });
    }
  }
}