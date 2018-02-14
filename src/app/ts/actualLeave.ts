import * as moment from 'moment/moment';

export class ActualLeave{
	dateFrom:string;
	dateTo:string;
	emp_id:string;
	no_Days:number;
	
	
	constructor(dateFrom:string,dateTo:string) {
		console.log("fff");
    this.dateFrom = dateFrom;
    this.dateTo = dateTo;
    //this.noOfDays = 3";
	this.calculateNoOfDays();
  }
  calculateNoOfDays() {
	  var dateFrom_array = this.dateFrom.split('/');
	  var dateTo_array = this.dateTo.split('/');
	  var date1 = moment([dateFrom_array[2], dateFrom_array[0], dateFrom_array[1]]);
	  var date2 = moment([dateTo_array[2], dateTo_array[0], dateTo_array[1]]);
	  this.no_Days = date2.diff(date1, 'days');
  }
}