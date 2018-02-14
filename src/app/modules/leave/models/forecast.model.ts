import { LeaveModel } from './leave.model';
import { DayModel } from './days.model';

export class ForecastModel {
   
   constructor(data){
   	 let monthNames = Object.keys(data);
   	 for(let i=0; i< monthNames.length; i++){
   	 	this[monthNames[i]] = [];
   	 	let leavesForMonth = data[monthNames[i]];
   	 	for(var j=0; j<leavesForMonth.length; j++){
   	 		this[monthNames[i]].push(leavesForMonth[j]);
   	 	}
   	 }
   };
   getNoOfMonthsForecast(data): Array<DayModel> {
     let result = [];
     let months = Object.keys(data);
     for(let key in months){
        result.push(new DayModel(months[key],null,null,null));
     }
     return result;
   }
   getNoOfMonthsActual(data): DayModel {
     return new DayModel(data[0].month,null,null,null)
   }	 
}