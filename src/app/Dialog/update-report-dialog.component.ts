import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { Report } from './../Report/report';

@Component({
  selector: 'update-report',
  templateUrl: 'update-report-dialog.html',
  styleUrls: ['update-report-dialog.css'],
})
export class UpdateReportDialog {



  constructor(
    public dialogRef: MatDialogRef<UpdateReportDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
      
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
