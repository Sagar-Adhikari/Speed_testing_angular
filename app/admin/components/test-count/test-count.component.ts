import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { ChartService } from '../chart/chart.service';
import { MatSnackBar } from '@angular/material';
import { LayoutService } from 'src/app/layout.service';

@Component({
  selector: 'app-test-count',
  templateUrl: './test-count.component.html',
  styleUrls: ['./test-count.component.scss']
})
export class TestCountComponent implements OnInit {

  fromDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
  toDate = new Date();
  locationList: any[] = [];
  selectedLocation: string = '';
  loading = false;
  bandwidth = '';

  public lineChartData: ChartDataSets[] = [
    { data: [], label: 'Total' },

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
  public lineChartType = 'bar';
  public lineChartPlugins = [];

  constructor(private chartService: ChartService,
    private snackBar: MatSnackBar,
    private layoutService: LayoutService) {
    this.displayReport();
    this.layoutService.setLayout({ pageTitle: 'Total Test In Charts', allowFooter: true })
  }

  displayReport() {
    this.loading = true;
    this.lineChartData = [
      { data: [], label: 'Nepal' },
      { data: [], label: 'Singapore' },
    ];
    this.chartService.getCountOfTest(this.fromDate, this.toDate,
      this.selectedLocation).subscribe(x => {
        const nepal = [];
        const singapore = [];
        const label = [];
        for (let i = 0; i < x.data.length; i++) {
          if (x.data[i].site === 0) {
            nepal.push(x.data[i].count);
          } else {
            singapore.push(x.data[i].count);
          }
          label.push(x.data[i].internetServiceProvider);
        };
        this.lineChartData = [
          { data: nepal, label: 'Nepal' },
          { data: singapore, label: 'Singapore' }
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


  ngOnInit() {
  }

  itemChange($event: any, flag: string) {
    if ($event.isUserInput) {

      this.selectedLocation = $event.source.value;

      this.displayReport();
    }
  }

  dateChange(value: string, flag: string) {
    this.displayReport();
  }


  bandwidthChanged($event: any) {
    this.displayReport()
  }
}
