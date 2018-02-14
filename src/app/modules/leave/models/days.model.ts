export class DayModel{
	month: string;
	dateFrom: any;
	dateTo: any;
	totalNoOFDays: string;

	constructor(month, dateFrom, dateTo, totalNoOFDays){
		this.month = month;
		this.dateFrom = dateFrom;
		this.dateTo = dateTo;
		this.totalNoOFDays = totalNoOFDays;
	}
}