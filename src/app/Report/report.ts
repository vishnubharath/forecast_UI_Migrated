import {ReportAdjusment} from './reportAdjusments'

export class Report{

    reportId: number;    
    employeeId:number;    
    associateId:number;    
    associateName:string;    
    associateCity:string;    
    locationType:string;    
    customerId:number;    
    customerName:string;    
    projectId:number;    
    projectName:string;    
    billableType:string;    
    associateGrade:string;    
    allocStartDate:Date;  
    allocEndDate:Date; 
    allocationPercentage:string;     
    projectBillability:string;    
    forecastPeriodFrom:number;    
    forecastPeriodTo:number;    
    forecastedOn:number;    
    lastUpdatedUser:string;    
    lastUpdatedTime:number;    
    portfolio:string;    
    poc:string;
    reportAdjustmentEntity:ReportAdjusment[]
    }