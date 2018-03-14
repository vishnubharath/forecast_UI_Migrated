import { Report } from "../Report/report";
import { ReportType } from "../Report/ReportType";
import { ReportAdjusment } from "../Report/reportAdjusments";
import { ReportService } from "../Report/report.service";

export class Utils{
  public  static locationType:string[]=["Onsite","Offshore"];
  public static cityList:string[]=["CHENNAI","KOLKATA","LONDON","NEWYORK","PUNE","TORONTO"];
  public  static billability:string[]=["Y","N"];
  public static numberOfMonths:number=12;
  sampleData:Report;
	// getCityList(){
	// 	return this.cityList;
 	// }
    // getLocationType(){
	// 	return this.locationType;
  	// }

  convertFinalReport(finalRecord:ReportType[]){
		var serviceRowData: Report[]=[];
		finalRecord.forEach(record=>{
			var recordData:Report = new Report();
			if(record.reportDataType!="duplicate"){
				recordData.reportId=  record.reportId;  
			}
			
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
			var d=new Date(record.allocStartDate);

			recordData.allocStartDate=d; 
			recordData.allocationPercentage=record.allocationPercentage; 
			d=new Date(record.allocEndDate);
			recordData.allocEndDate=d; 
			recordData.projectBillability=record.projectBillability;
			recordData.forecastPeriodFrom=record.forecastPeriodFrom;
			recordData.forecastPeriodTo=record.forecastPeriodTo;    
			recordData.forecastedOn=record.forecastedOn;   
			recordData.lastUpdatedUser=record.lastUpdatedUser;  
			recordData.lastUpdatedTime=record.lastUpdatedTime; 
			recordData.portfolio=record.portfolio;
			recordData.poc=record.poc;
			var reportAdjusments:ReportAdjusment[]  = [];
			for(let i=0;i<Utils.numberOfMonths;i++){
				//if(record["adjustment_"+[i+1]]!=null || record["adjustment_"+[i+1]]!="" || record["adjustment_"+[i+1]+"_id"]!=null || record["hours_"+[i+1]]!=null){
				if(!(record["adjustment_"+[i+1]+"_id"]===undefined)){
					var reportAdjusment:ReportAdjusment = new ReportAdjusment();
					if(record.reportDataType==="duplicate"){
						reportAdjusment.id=0;
					}else{
						reportAdjusment.id=record["adjustment_"+[i+1]+"_id"];
					}
					reportAdjusment.adjustment=record["adjustment_"+[i+1]];
					reportAdjusment.hours=record["hours_"+[i+1]];
					reportAdjusment.rate=record["rate_"+[i+1]];
					reportAdjusment.revenue=record["revenue_"+[i+1]];
					reportAdjusment.forecastedMonth=record["forecastedMonth_"+[i+1]];
					reportAdjusment.forecastedYear=record["forecastedYear_"+[i+1]];
					reportAdjusments.push(reportAdjusment);
				} else if(record.reportDataType==="NewData"){
				//	if(record["adjustment_"+[i+1]]!=undefined || record["hours_"+[i+1]]!=undefined || record["rate_"+[i+1]]!=undefined  ){
						var reportAdjusment:ReportAdjusment = new ReportAdjusment();
						reportAdjusment.id=0;
						reportAdjusment.adjustment=record["adjustment_"+[i+1]];
						reportAdjusment.hours=record["hours_"+[i+1]];
						reportAdjusment.rate=record["rate_"+[i+1]];
						reportAdjusment.revenue=record["revenue_"+[i+1]];
						reportAdjusment.forecastedMonth=record["forecastedMonth_"+[i+1]];
						reportAdjusment.forecastedYear=record["forecastedYear_"+[i+1]];
						reportAdjusments.push(reportAdjusment);
				//	}
				}
			}
			recordData.reportAdjustmentEntity=reportAdjusments;
			serviceRowData.push(recordData);
		});
		console.log(serviceRowData);
		return serviceRowData;
	}


  createDuplicateRow(reports:ReportType[],reportID:Boolean):ReportType[] {

		var reportTypes:ReportType[]  = [];
		reports.forEach(report => {
			var reportType:ReportType = new ReportType();
			reportType.allocStartDate = report.allocStartDate;
			if(reportID){
				reportType.reportId=report.reportId;
			}
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
			reportType.allocationPercentage = report.allocationPercentage;
			reportType.allocStartDate = report.allocStartDate;
			reportType.allocEndDate = report.allocEndDate;
			
			for (let index = 0; index < Utils.numberOfMonths; index++) {
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