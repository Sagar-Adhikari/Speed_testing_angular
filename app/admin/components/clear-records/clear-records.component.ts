import { MatSnackBar } from '@angular/material';
import { LayoutService } from 'src/app/layout.service';
import { ClearRecordsService } from './../../services/clear-records.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-clear-records',
  templateUrl: './clear-records.component.html',
  styleUrls: ['./clear-records.component.scss']
})
export class ClearRecordsComponent implements OnInit {

  tillDate = new Date(new Date().setMonth(new Date().getMonth() - 12));
  constructor(private clearRecordService: ClearRecordsService,
    private layoutService: LayoutService,
    private snackBar: MatSnackBar) {
    this.layoutService.setLayout({ pageTitle: 'Clear Records', allowFooter: true });


  }

  formatDate(x: any): string {
    const y = new Date(x).getFullYear();
    const m = new Date(x).getMonth() +1;
    const d = new Date(x).getDate();

    // const d = new Date(x).toLocaleDateString();
    // const t = new Date(x).toLocaleTimeString();
    return `${y}-${m}-${d}`;
  } 
  ngOnInit() {
  }

  clearRecords() {
    this.clearRecordService.clearRecords( this.formatDate(this.tillDate) ).subscribe((x: any) => {
      this.snackBar.open('Record Deleted Successfully!', undefined, {duration: 2000});
    });


  }

}
