import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import 'rxjs/Rx';
import { Observable }     from 'rxjs/Observable';
import { Constants } from '../constants';
import { Report } from './report';
import { error } from 'util';
import {ReportType} from './ReportType'
import { Adjustment } from './Adjustments';
import { Project } from './Project';
import { ReportAdjusment } from './reportAdjusments';

@Injectable()
export class ReportService{

	constructor(private _http:Http){

	}

	getCurrentReport():Observable<Report[]>{
		return this._http
		.get(Constants.base_url+'reports/all' )
		.map((res:Response) => res.json())
		.catch(error=>{
			let errMsg = (error.message) ? error.message :
				error.status ? `${error.status} - ${error.statusText}` : 'Server error';
			console.error(errMsg); // log to console instead
			return Observable.throw(errMsg);
		});
	}

	deleteReport(deleteRecord:ReportType[]){
		return this._http.post(Constants.base_url+'reports/deleteRecords',this.convertDuplicatReport(deleteRecord)).map((res:Response) => res.json())
		.catch(error=>{
			let errMsg = (error.message) ? error.message :
				error.status ? `${error.status} - ${error.statusText}` : 'Server error';
			console.error(errMsg); // log to console instead
			return Observable.throw(errMsg);
		});
	}
	getReportForProject(projects:string[]){

		var query:string = "?requestBy=";
		for(var i = 0;i<projects.length; i++){
			query = query + projects[i]+",";
		}
		
		return this._http
		.get(Constants.base_url+'reports/project'+query )
		.map((res:Response) => res.json())
		.catch(error=>{
			let errMsg = (error.message) ? error.message :
				error.status ? `${error.status} - ${error.statusText}` : 'Server error';
			console.error(errMsg); // log to console instead
			return Observable.throw(errMsg);
		});
	}


	reportsave(adjustments:Adjustment[]):Promise<ReportType> {
		return this._http.post(Constants.base_url+'reports/saveRowRecord',adjustments).toPromise().then((res:Response)=>res.json())
           .catch(error=>console.log(error));
		
	}

	
	duplicateReportSave(duplicateRecord:ReportType[]):Promise<ReportType> {
		console.log(this.convertDuplicatReport(duplicateRecord));
		
		return this._http.post(Constants.base_url+'reports/duplicateRecordSave',this.convertDuplicatReport(duplicateRecord)).toPromise().then(res=>{console.log("duplicateRecordSave response"+res);return res.json()})
           .catch(error=>console.log(error));
	}

	convertDuplicatReport(duplicateRecord:ReportType[]){
		var serviceRowData: Report[]=[];
		duplicateRecord.forEach(record=>{
			var recordData:Report = new Report();
			//recordData.reportId=  record.reportId;  
			recordData.employeeId=record.employeeId;    
			recordData.associateId=record.associateId;
			recordData.associateName=record.associateName;  
			recordData.associateCity=record.city;    
			recordData.locationType=record.location;    
			recordData.customerId=record.customerId; 
			recordData.customerName=record.customerName; 
			recordData.projectId=record.projectId; 
			recordData.projectName=record.projectName; 
			recordData.billableType=record.billability; 
			recordData.associateGrade=record.associateGrade;
			recordData.allocStartDate=record.allocStartDate; 
			recordData.projectBillability=record.projectBillability;
			recordData.forecastPeriodFrom=record.forecastPeriodFrom;
			recordData.forecastPeriodTo=record.forecastPeriodTo;    
			recordData.forecastedOn=record.forecastedOn;   
			recordData.lastUpdatedUser=record.lastUpdatedUser;  
			recordData.lastUpdatedTime=record.lastUpdatedTime; 
			recordData.portfolio=record.portfolio;
			recordData.poc=record.poc;
			var reportAdjusments:ReportAdjusment[]  = [];
			for(let i=0;i<12;i++){
				//if(record["adjustment_"+[i+1]]!=null || record["adjustment_"+[i+1]]!="" || record["adjustment_"+[i+1]+"_id"]!=null || record["hours_"+[i+1]]!=null){
					if(!(record["adjustment_"+[i+1]+"_id"]===undefined)){
					var reportAdjusment:ReportAdjusment = new ReportAdjusment();
					//reportAdjusment.id=record["adjustment_"+[i+1]+"_id"];
					reportAdjusment.adjustment=record["adjustment_"+[i+1]];
					reportAdjusment.hours=record["hours_"+[i+1]];
					reportAdjusment.rate=record["rate_"+[i+1]];
					reportAdjusment.revenue=record["revenue_"+[i+1]];
					reportAdjusment.forecastedMonth=record["forecastedMonth_"+[i+1]];
					reportAdjusment.forecastedYear=record["forecastedYear_"+[i+1]];
					reportAdjusments.push(reportAdjusment);
				}
			}
			recordData.reportAdjustmentEntity=reportAdjusments;
			serviceRowData.push(recordData);
		});
		return serviceRowData;
	}

	 convertReport(reports:Report[]):ReportType[] {

		var reportTypes:ReportType[]  = [];

		reports.forEach(report => {
			
			var reportType:ReportType = new ReportType();

			reportType.allocStartDate = report.allocStartDate;
			reportType.city = report.associateCity;
			reportType.associateGrade = report.associateGrade;
			reportType.associateId = report.associateId;
			reportType.associateName = report.associateName;
			reportType.billability = report.billableType;
			reportType.customerId = report.customerId;
			reportType.customerName = report.customerName;
			reportType.employeeId = report.employeeId;
			reportType.forecastedOn = report.forecastedOn;
			reportType.forecastPeriodFrom = report.forecastPeriodFrom;
			reportType.forecastPeriodTo = report.forecastPeriodTo;
			reportType.lastUpdatedTime = report.lastUpdatedTime;
			reportType.lastUpdatedUser = report.lastUpdatedUser;
			reportType.location = report.locationType;
			reportType.poc = report.poc;
			reportType.portfolio = report.portfolio;
			reportType.projectBillability = report.projectBillability;
			reportType.projectId = report.projectId;
			reportType.projectName = report.projectName;
			reportType.reportId = report.reportId;
			

			for (let index = 0; index < report.reportAdjustmentEntity.length; index++) {

		
				reportType["adjustment_"+[index+1]+"_id"] = report.reportAdjustmentEntity[index].id;
				reportType["adjustment_"+[index+1]] = report.reportAdjustmentEntity[index].adjustment;
				reportType["hours_"+[index+1]]= report.reportAdjustmentEntity[index].hours;
				reportType["rate_"+[index+1]] = report.reportAdjustmentEntity[index].rate;
				reportType["revenue_"+[index+1]]  = report.reportAdjustmentEntity[index].revenue;
				reportType["forecastedMonth_"+[index+1]]  = report.reportAdjustmentEntity[index].forecastedMonth;
				reportType["forecastedYear_"+[index+1]]  = report.reportAdjustmentEntity[index].forecastedYear;


		
			}

			// for (let index = 0; index < report.reportAdjusments.length; index++) {

			// 	if(index == 0){
			// 		reportType.adjustment_1_id = report.reportAdjusments[index].id;
			// 		reportType.adjustment_1 = report.reportAdjusments[index].adjustment;
			// 		reportType.hours_1 = report.reportAdjusments[index].hours;
			// 		reportType.rate_1 = report.reportAdjusments[index].rate;
			// 		reportType.revenue_1 = report.reportAdjusments[index].revenue;
			// 	}

			// 	if(index == 1){
			// 		reportType.adjustment_2_id = report.reportAdjusments[index].id;
			// 		reportType.adjustment_2 = report.reportAdjusments[index].adjustment;
			// 		reportType.hours_2 = report.reportAdjusments[index].hours;
			// 		reportType.rate_2 = report.reportAdjusments[index].rate;
			// 		reportType.revenue_2 = report.reportAdjusments[index].revenue;
			// 	}

			// 	if(index == 2){
			// 		reportType.adjustment_3_id = report.reportAdjusments[index].id;
			// 		reportType.adjustment_3 = report.reportAdjusments[index].adjustment;
			// 		reportType.hours_3 = report.reportAdjusments[index].hours;
			// 		reportType.rate_3 = report.reportAdjusments[index].rate;
			// 		reportType.revenue_3 = report.reportAdjusments[index].revenue;
			// 	}

			// 	if(index == 3){
			// 		reportType.adjustment_4_id = report.reportAdjusments[index].id;
			// 		reportType.adjustment_4 = report.reportAdjusments[index].adjustment;
			// 		reportType.hours_4 = report.reportAdjusments[index].hours;
			// 		reportType.rate_4 = report.reportAdjusments[index].rate;
			// 		reportType.revenue_4 = report.reportAdjusments[index].revenue;
			// 	}

			// 	if(index == 4){
			// 		reportType.adjustment_5_id = report.reportAdjusments[index].id;
			// 		reportType.adjustment_5 = report.reportAdjusments[index].adjustment;
			// 		reportType.hours_5 = report.reportAdjusments[index].hours;
			// 		reportType.rate_5 = report.reportAdjusments[index].rate;
			// 		reportType.revenue_5 = report.reportAdjusments[index].revenue;
			// 	}

			// 	if(index == 5){
			// 		reportType.adjustment_6_id = report.reportAdjusments[index].id;
			// 		reportType.adjustment_6 = report.reportAdjusments[index].adjustment;
			// 		reportType.hours_6 = report.reportAdjusments[index].hours;
			// 		reportType.rate_6 = report.reportAdjusments[index].rate;
			// 		reportType.revenue_6 = report.reportAdjusments[index].revenue;
			// 	}
			// }
			
			reportTypes.push(reportType);
		})
		

		console.log("....");		
		console.log(reportTypes);
		

		return reportTypes;
	}

	createDuplicateRow(reports:ReportType[]):ReportType[] {

		var reportTypes:ReportType[]  = [];
		reports.forEach(report => {
			var reportType:ReportType = new ReportType();
			reportType.allocStartDate = report.allocStartDate;
			reportType.city = report.city;
			reportType.associateGrade = report.associateGrade;
			reportType.associateId = report.associateId;
			reportType.associateName = report.associateName;
			reportType.billability = report.billability;
			reportType.customerId = report.customerId;
			reportType.customerName = report.customerName;
			reportType.employeeId = report.employeeId;
			reportType.forecastedOn = report.forecastedOn;
			reportType.forecastPeriodFrom = report.forecastPeriodFrom;
			reportType.forecastPeriodTo = report.forecastPeriodTo;
			reportType.lastUpdatedTime = report.lastUpdatedTime;
			reportType.lastUpdatedUser = report.lastUpdatedUser;
			reportType.location = report.location;
			reportType.poc = report.poc;
			reportType.portfolio = report.portfolio;
			reportType.projectBillability = report.projectBillability;
			reportType.projectId = report.projectId;
			reportType.projectName = report.projectName;
			
			for (let index = 0; index < 12; index++) {
				if(report["adjustment_"+[index+1]+"_id"]!=null && report["adjustment_"+[index+1]+"_id"]!=""){
				reportType["adjustment_"+[index+1]+"_id"] = report["adjustment_"+[index+1]+"_id"];
				reportType["adjustment_"+[index+1]] = report["adjustment_"+[index+1]];
				reportType["hours_"+[index+1]]= report["hours_"+[index+1]];
				reportType["rate_"+[index+1]] = report["rate_"+[index+1]];
				reportType["revenue_"+[index+1]]  = report["revenue_"+[index+1]];
				reportType["associateId"]  = report.associateId;
				reportType["projectId"]  = report.projectId;
				reportType["locationType"]  = report.location;
				reportType["forecastedYear_"+[index+1]]  = report["forecastedYear_"+[index+1]];
				reportType["forecastedMonth_"+[index+1]]  = report["forecastedMonth_"+[index+1]];
				}
		
				
			}
			reportTypes.push(reportType);
		});


		return reportTypes;
	}
}