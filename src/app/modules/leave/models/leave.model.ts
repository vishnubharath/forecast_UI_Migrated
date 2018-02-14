import * as moment from 'moment';

export class LeaveModel {
	empId: number = 0;
	month: string = '';
	year: string = '';
	datefrom: string = '';
	dateTo: string = '';
	noOfDays: string = '';
	region: string = '';
	updatedOn: string = '';
	type: string = '';

	constructor(startDate: string, endDate: string, noOfDays: string, month: string, reqModel) {
    	let from = moment(startDate).format('YYYY-MM-DD');
    	let to = moment(endDate).format('YYYY-MM-DD');
		this.empId = reqModel.empId;
		this.month = month;
		this.year = reqModel.year;
		this.datefrom = from;
		this.dateTo = to;
		this.noOfDays = noOfDays;
		this.region = reqModel.region;
		this.updatedOn = '';
		this.type = reqModel.type;
	}
}