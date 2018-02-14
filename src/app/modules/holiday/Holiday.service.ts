
import {Injectable } from '@angular/core';
import {Http, Response, Headers, RequestOptions, URLSearchParams} from "@angular/http";
import 'rxjs/Rx';
import { Observable }     from 'rxjs/Observable';

import {Holiday} from "./Holiday";


@Injectable()
export class HolidayService{

	//baseUrl:string="https://myangularproject-3768f.firebaseio.com";
	baseUrl:string="http://localhost:8080/forecast-1.0.0-SNAPSHOT/holidays";

	constructor(private _http:Http){

	}


	getHolidays():Promise<Holiday>{
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


}
