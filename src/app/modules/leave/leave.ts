import {ForecastMonths} from '../../ts/ForecastMonths';
import {ActualLeave} from '../../ts/actualLeave';
export class Leave{
	date:string;
	region:string;
	description:string;
	forecastLeave:ForecastMonths[];
	actualLeave:ActualLeave[];
	emp_ID:string;
}