import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import 'rxjs/Rx';
import { Observable }     from 'rxjs/Observable';
import { Constants } from '../constants';
import { Report } from './report';
import { error } from 'util';
import {ReportType} from './ReportType'
import { Adjustment } from './Adjustments';

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


	reportsave(adjustments:Adjustment[]):Promise<ReportType> {
		return this._http.post(Constants.base_url+'reports/saveRowRecord',adjustments).toPromise().then((res:Response)=>res.json())
           .catch(error=>console.log(error));
		
	}

	 convertReport(reports:Report[]):ReportType[] {

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
			reportType.reportId = report.reportId;
			


			for (let index = 0; index < report.reportAdjusments.length; index++) {

				if(index == 0){
					reportType.adjustment_1_id = report.reportAdjusments[index].id;
					reportType.adjustment_1 = report.reportAdjusments[index].adjustment;
					reportType.hours_1 = report.reportAdjusments[index].hours;
					reportType.rate_1 = report.reportAdjusments[index].rate;
					reportType.revenue_1 = report.reportAdjusments[index].revenue;
				}

				if(index == 1){
					reportType.adjustment_2_id = report.reportAdjusments[index].id;
					reportType.adjustment_2 = report.reportAdjusments[index].adjustment;
					reportType.hours_2 = report.reportAdjusments[index].hours;
					reportType.rate_2 = report.reportAdjusments[index].rate;
					reportType.revenue_2 = report.reportAdjusments[index].revenue;
				}

				if(index == 2){
					reportType.adjustment_3_id = report.reportAdjusments[index].id;
					reportType.adjustment_3 = report.reportAdjusments[index].adjustment;
					reportType.hours_3 = report.reportAdjusments[index].hours;
					reportType.rate_3 = report.reportAdjusments[index].rate;
					reportType.revenue_3 = report.reportAdjusments[index].revenue;
				}

				if(index == 3){
					reportType.adjustment_4_id = report.reportAdjusments[index].id;
					reportType.adjustment_4 = report.reportAdjusments[index].adjustment;
					reportType.hours_4 = report.reportAdjusments[index].hours;
					reportType.rate_4 = report.reportAdjusments[index].rate;
					reportType.revenue_4 = report.reportAdjusments[index].revenue;
				}

				if(index == 4){
					reportType.adjustment_5_id = report.reportAdjusments[index].id;
					reportType.adjustment_5 = report.reportAdjusments[index].adjustment;
					reportType.hours_5 = report.reportAdjusments[index].hours;
					reportType.rate_5 = report.reportAdjusments[index].rate;
					reportType.revenue_5 = report.reportAdjusments[index].revenue;
				}

				if(index == 5){
					reportType.adjustment_6_id = report.reportAdjusments[index].id;
					reportType.adjustment_6 = report.reportAdjusments[index].adjustment;
					reportType.hours_6 = report.reportAdjusments[index].hours;
					reportType.rate_6 = report.reportAdjusments[index].rate;
					reportType.revenue_6 = report.reportAdjusments[index].revenue;
				}
			}
			
			reportTypes.push(reportType);
		})
		

		console.log("....");		
		console.log(reportTypes);
		

		return reportTypes;
	}
}