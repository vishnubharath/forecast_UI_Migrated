
import {Injectable } from '@angular/core';
import {Http, Response, Headers, RequestOptions, URLSearchParams} from "@angular/http";
import 'rxjs/Rx';
import { Observable }     from 'rxjs/Observable';

import {ForecastMonths} from './ForecastMonths';
import {Leave} from '../modules//leave/leave';


@Injectable()
export class ForecastMonthsService{

	//baseUrl:string="https://myangularproject-3768f.firebaseio.com";
	baseUrl:string="http://localhost:8080/forecast-1.0.0-SNAPSHOT/leaves";
	baseUrlMonths:string="http://localhost:8080/forecast-1.0.0-SNAPSHOT/leaveMonths";
							  

	constructor(private _http:Http){
	}


	getForecastMonths():Promise<Leave>{
	console.log("forecast months");
		return this._http
			.get(this.baseUrl )
			.toPromise()
			.then((res:Response)=>res.json())
			.catch(error=>{
				let errMsg = (error.message) ? error.message :
					error.status ? `${error.status} - ${error.statusText}` : 'Server error';
				console.error(errMsg); // log to console instead
				return Observable.throw(errMsg);
			});

	}
	
	getMonths():Promise<string>{
		return this._http
			.get(this.baseUrlMonths)
			.toPromise()
			.then((res:Response)=>res.json())
			.catch(error=>{
				let errMsg = (error.message) ? error.message :
					error.status ? `${error.status} - ${error.statusText}` : 'Server error';
				console.error(errMsg); // log to console instead
				return Observable.throw(errMsg);
			});
	}

	/*getMonthsMap():Promise<Map>{
	var mapMonth = new Map<number,string>();
	mapMonth.set("Nov","2");
	mapMonth.set("Dec","2");
	
	
	}*/
	
}
