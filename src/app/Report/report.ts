import {ReportAdjusment} from './reportAdjusments'
export class Report{

    reportId: number;    
    employeeId:number;    
    associateId:number;    
    associateName:string;    
    city:string;    
    location:string;    
    customerId:number;    
    customerName:string;    
    projectId:number;    
    projectName:string;    
    billability:string;    
    associateGrade:string;    
    allocStartDate:number;    
    projectBillability:string;    
    forecastPeriodFrom:number;    
    forecastPeriodTo:number;    
    forecastedOn:number;    
    lastUpdatedUser:string;    
    lastUpdatedTime:number;    
    portfolio:string;    
    poc:string;
    reportAdjusments:ReportAdjusment[]
    }