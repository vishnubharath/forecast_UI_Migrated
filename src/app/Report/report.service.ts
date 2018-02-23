import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import 'rxjs/Rx';
import { Observable }     from 'rxjs/Observable';
import { Constants } from '../constants';
import { Report } from './report';
import { error } from 'util';
@Injectable()
export class ReportService{

	constructor(private _http:Http){

	}

	getCurrentReport():Observable<Report[]>{
		return this._http
		.get(Constants.base_url+'reports/all' )
		.map((res:Response) => res.json())
		.catch(error=>{
			let errMsg = (error.message) ? error.message :
				error.status ? `${error.status} - ${error.statusText}` : 'Server error';
			console.error(errMsg); // log to console instead
			return Observable.throw(errMsg);
		});
	}


	Reportsave(reports:Report[]):Promise<Report> {
		return this._http.post(Constants.base_url+'reports/saveRowRecord',reports).toPromise().then((res:Response)=>res.json())
           .catch(error=>console.log(error));
		
	}
}