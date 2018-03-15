import { Injectable, ViewContainerRef } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import 'rxjs/Rx';
import { Observable }     from 'rxjs/Observable';
import { Constants } from '../Constant/constants';
import { Report } from './report';
import { error } from 'util';
import {ReportType} from './ReportType'
import { Adjustment } from './Adjustments';
import { Project } from './Project';
import { ReportAdjusment } from './reportAdjusments';
import { ToastsManager } from 'ng2-toastr';
import { Utils } from '../Constant/Utils';

@Injectable()
export class ReportService{

	sampleData:Report;
	constructor(private _http:Http){

	}

	getAllReports():Observable<Report[]>{
		return this._http
		.get(Constants.base_url+'reports/all' )
		.map((res:Response) => {return res.json();})
		.catch(error=>{
			let errMsg = (error.message) ? error.message :
				error.status ? `${error.status} - ${error.statusText}` : 'Server error';
			console.error(errMsg); // log to console instead
			return Observable.throw(errMsg);
		});
	}

	deleteReport(deleteRecord:ReportType[]){
		return this._http.post(Constants.base_url+'reports/deleteRecords',new Utils().convertFinalReport(deleteRecord))
		.catch(error=>{
			let errMsg = (error.message) ? error.message :
				error.status ? `${error.status} - ${error.statusText}` : 'Server error';
			console.error(error); // log to console instead
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
	

	finalReportSave(finalRecord:ReportType[]) {
		console.log(new Utils().convertFinalReport(finalRecord));
		return this._http.post(Constants.base_url+'reports/saveRecords',new Utils().convertFinalReport(finalRecord))
           .catch(error=>{
			let errMsg = (error.message) ? error.message :
				error.status ? `${error.status} - ${error.statusText}` : 'Server error';
			console.error(error); // log to console instead
			return Observable.throw(errMsg);
		});
	}

	convertReport(reports:Report[]):ReportType[] {
		let index=0;
		for(let i=0;i<reports.length;i++){
			if(reports[i].reportAdjustmentEntity.length===6){
			   index=i;
			   console.log("index of the record");
			   console.log(index);
			   break;
			}
		}
		this.sampleData=reports[index];
		var reportTypes:ReportType[]  = [];
		console.log("samepl data ");
		console.log(this.sampleData);

		reports.forEach(report => {
			console.log("inside conver report");
			
			var reportType:ReportType = new ReportType();
			reportType.reportId = report.reportId;
			var d = new Date(report.allocStartDate);
			reportType.allocStartDate = d.toISOString().split('T')[0];
			 d = new Date(report.allocEndDate);
			reportType.allocEndDate = d.toISOString().split('T')[0];
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
			
			reportType.allocationPercentage = report.allocationPercentage;
			reportType.lastUpdatedTime = report.lastUpdatedTime;
			reportType.lastUpdatedUser = report.lastUpdatedUser;
			reportType.location = report.locationType;
			reportType.poc = report.poc;
			reportType.portfolio = report.portfolio;
			reportType.projectBillability = report.projectBillability;
			reportType.projectId = report.projectId;
			reportType.projectName = report.projectName;
			
			for (let index = 0; index < report.reportAdjustmentEntity.length; index++) {

		
				reportType["adjustment_"+[index+1]+"_id"] = report.reportAdjustmentEntity[index].id;
				reportType["adjustment_"+[index+1]] = report.reportAdjustmentEntity[index].adjustment;
				 if(report.reportAdjustmentEntity[index].hours===undefined){
				 	reportType["hours_"+[index+1]]=0;
				 }else{
					reportType["hours_"+[index+1]]= report.reportAdjustmentEntity[index].hours;
				 }
				reportType["rate_"+[index+1]] = report.reportAdjustmentEntity[index].rate;
				reportType["revenue_"+[index+1]]  = report.reportAdjustmentEntity[index].revenue;
				reportType["forecastedMonth_"+[index+1]]  = report.reportAdjustmentEntity[index].forecastedMonth;
				reportType["forecastedYear_"+[index+1]]  = report.reportAdjustmentEntity[index].forecastedYear;
		
			}
			reportTypes.push(reportType);
		})
		

		console.log("....");		
		console.log(reportTypes);
		

		return reportTypes;
	}
	

		

	convertNewData(record:any):ReportType[]{
		console.log("inside convertData");
		console.log(record);
		var reports:ReportType[]  = [];
		var report:ReportType = new ReportType();
		for(let i=0;i<Utils.numberOfMonths;i++){
		  report["adjustment_"+[i+1]]=0;
		  report["hours_"+[i+1]]=0;
		  report["rate_"+[i+1]]=0;
		  report["revenue_"+[i+1]]=0;
		//	if(record["forecastedMonth_year_"+[i]]!=undefined && record["forecastedMonth_year_"+[i]]!=null){
		  //	var tmp=record["forecastedMonth_year_"+[i]].split("-");
			report["forecastedMonth_"+[i+1]]=this.sampleData.reportAdjustmentEntity[i].forecastedMonth;
			report["forecastedYear_"+[i+1]]=this.sampleData.reportAdjustmentEntity[i].forecastedYear;
		//	}
		  // if(record["adjustment_"+[i]]!=undefined && record["adjustment_"+[i]]!=null){
		  // 	report["adjustment_"+[i+1]]=record["adjustment_"+[i]];
		  // }
		  // if(record["hours_"+[i]]!=undefined && record["hours_"+[i]]!=null){
		  // 	report["hours_"+[i+1]]=record["hours_"+[i]];
		  // }
		  // if(record["rate_"+[i]]!=undefined && record["rate_"+[i]]!=null){
		  // 	report["rate_"+[i+1]]=record["rate_"+[i]];
		  // }
		  // if(record["forecastedMonth_year_"+[i]]!=undefined && record["forecastedMonth_year_"+[i]]!=null){
		  // 	var tmp=record["forecastedMonth_year_"+[i]].split("-");
		  // 	report["forecastedMonth_"+[i+1]]=tmp[0];
		  // 	report["forecastedYear_"+[i+1]]=tmp[1];
		  // }
		  // if(record["hours_"+[i]]!=undefined && record["hours_"+[i]]!=null){
		  // 	report["revenue_"+[i+1]]=(record["hours_"+[i]] - record["adjustment_"+[i]]) * record["rate_"+[i]];
		  // }
		}
		report["associateName"]=record["associateName"];
		report["projectName"]=record["projectName"];
		report["associateId"]=record["associateId"];
		report["location"]=record["locationType"];
		report["projectId"]=record["projectId"];
		report["associateGrade"]=record["associateGrade"];
		report["city"]=record["city"];
		report["billability"]=record["billability"];
		report["customerId"]=record["customerId"];
		report["customerName"]=record["customerName"];
		report["portfolio"]=record["portfolio"];
		report["poc"]=record["poc"];
		
		report["projectBillability"]=record["projectBillability"];
		//report["allocStartDate"]=record["allocStartDate"].toLocaleDateString();
		if(record["allocStartDate"]!=undefined){
		  report["allocStartDate"]=record["allocStartDate"].toISOString().split('T')[0];
		}
		if(record["allocEndDate"]!=undefined){
		  report["allocEndDate"]=record["allocEndDate"].toISOString().split('T')[0];
		  console.log(record["allocEndDate"].toISOString().split('T')[0]);
		  console.log(record["allocEndDate"].toISOString());
		  console.log((record["allocEndDate"].toDateString()));
		}
		report["allocationPercentage"]=record["allocationPercentage"];
		report.reportDataType="NewData";
		reports.push(report);
		console.log("final data ...");
		console.log(reports);
		return reports;
	  }
	
}