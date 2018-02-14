import { ForecastModel } from './forecast.model';
import { ActualModel } from './actual.model';
import { LeaveModel } from './leave.model';

export class ForecastActualModel {
   empId : string ='';
   forecastLeaves : ForecastModel;
   actualleaves : LeaveModel[];

   constructor(data) {
   	  this.empId = data['empId'];
      this.forecastLeaves = new ForecastModel(data['forecastLeaves']);
      this.actualleaves = data['actualleaves'];
   };

   removeLeaveObj(eachForecastLeave, leaveType) {
        if(leaveType === 'forecast'){
           let month = eachForecastLeave['month'];
           let index = this.forecastLeaves[month].indexOf(eachForecastLeave);
           this.forecastLeaves[month].splice(index,1);
        }else if(leaveType === 'actual'){
           let index = this.actualleaves.indexOf(eachForecastLeave);
           this.actualleaves.splice(index,1);
        }
   	  
   }
}