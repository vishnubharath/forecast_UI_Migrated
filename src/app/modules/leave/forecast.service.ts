import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { ForecastActualModel } from './models/forecastActual.model';
import 'rxjs/Rx';
@Injectable()
export class ForeCastService {
    
    private getForecastUrl = 'http://localhost:8080/forecast-1.0.0-SNAPSHOT/leavesByEmpId/13456';
    private postForecastUrl = 'http://localhost:8080/forecast-1.0.0-SNAPSHOT/forecastLeaves';
    private postActualUrl = 'http://localhost:8080/forecast-1.0.0-SNAPSHOT/actualLeaves';
    
    constructor (private http: Http) {};

    getForecastDetails(): Observable<ForecastActualModel>  {
    	return this.http.get(this.getForecastUrl)
                   .map(this.extractData)
                   .catch(this.handleError);
    }
    saveForecastDetails(data:any): Observable<any> {
       let headers = new Headers({ 'Content-Type': 'application/json' });
       let options = new RequestOptions({ headers: headers });
       return this.http.put(this.postForecastUrl, data, options)
                       .map(this.extractData)
                       .catch(this.handleError);
    }
    saveActualDetails(data:any): Observable<any> {
       let headers = new Headers({ 'Content-Type': 'application/json' });
       let options = new RequestOptions({ headers: headers });
       return this.http.put(this.postActualUrl, data, options)
                       .map(this.extractData)
                       .catch(this.handleError);
    }
    private extractData(res: Response) {
        let body = res.json();
        return body || { };
    }
    private handleError (error: Response | any) {
	    let errMsg: string;
	    if (error instanceof Response) {
	      const body = error.json() || '';
	      const err = body.error || JSON.stringify(body);
	      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
	    } else {
	      errMsg = error.message ? error.message : error.toString();
	    }
	    console.error(errMsg);
	    return Observable.throw(errMsg);
  }
}