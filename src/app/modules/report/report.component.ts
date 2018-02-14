import { Component } from '@angular/core';
import {SelectItem,CalendarModule,DataTableModule,SharedModule,ButtonModule} from 'primeng/primeng';
import { ReportService } from "./report.service";
import { Report} from "./report";
//import { ReportSearch} from "./report.search";



@Component({
    selector: 'reportComponent',
    templateUrl:'app/modules/report/report.html',
})
export class ReportComponent {

	response: string;
	report: Report;
    reportValue:Report;
	errorMessage: any;
	typeOfReport: SelectItem[];
	months: SelectItem[];
	years: SelectItem[];
	reportName:string;
	selectedMonth:string;
	selectedYear:string;

	constructor(private _reportService: ReportService) {
		this.typeOfReport=[];
		this.typeOfReport.push({label:'Select report', value:null});
    this.typeOfReport.push({label:'Actual Report', value:'actual'});
    this.typeOfReport.push({label:'Forecast Report', value:'forecast'});
    this.months=[];
    this.months.push({label:'Select month', value:null});
    this.months.push({label:'JAN', value:'JAN'});
    this.months.push({label:'FEB', value:'FEB'});
    this.months.push({label:'MAR', value:'MAR'});
    this.months.push({label:'APR', value:'APR'});
    this.months.push({label:'MAY', value:'MAY'});
    this.months.push({label:'JUN', value:'JUN'});
    this.months.push({label:'JUL', value:'JUL'});
    this.months.push({label:'AUG', value:'AUG'});
    this.months.push({label:'SEP', value:'SEP'});
    this.months.push({label:'OCT', value:'OCT'});
    this.months.push({label:'NOV', value:'NOV'});
    this.months.push({label:'DEC', value:'DEC'});
    this.years=[];
    this.years.push({label:'Select year', value:null});
    this.years.push({label:'2014', value:'2014'});
    this.years.push({label:'2015', value:'2015'});
    this.years.push({label:'2016', value:'2016'});
    this.years.push({label:'2017', value:'2017'});
    this.years.push({label:'2018', value:'2018'});
    this.years.push({label:'2019', value:'2019'});
    this.years.push({label:'2020', value:'2020'});
    this.years.push({label:'2021', value:'2021'});
    this.years.push({label:'2022', value:'2022'});
    this.years.push({label:'2023', value:'2023'});
    this.years.push({label:'2024', value:'2024'});
    this.years.push({label:'2025', value:'2025'});
	}

ngOnInit(){
	this._reportService
			.getCurrentReport()
			.then(
			report=>this.report=report,
				error =>  this.errorMessage = <any>error
			);
	}
	
 

save() {
                console.log("save");
                this._reportService.saveReportData(this.report);    
                }

}


