import {Injectable } from '@angular/core';
import {Http, Response, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import 'rxjs/Rx';
import { Observable }     from 'rxjs/Observable';
import {project_Pipeline} from './project_pipeline';


@Injectable()
export class ProjectPipelineService{
	baseUrl:string="http://localhost:8080/forecast-1.0.0-SNAPSHOT/post/testing/";
	constructor(private _http:Http){
	}


	getStaffPipelineData(url:string):Promise<project_Pipeline[]>{
	
		return this._http
			.get(url)
			.toPromise()
			.then((res:Response)=>res.json())
			.catch(error=>{
				let errMsg = (error.message) ? error.message :
					error.status ? `${error.status} - ${error.statusText}` : 'Server error';
				console.error(errMsg); // log to console instead
				return Observable.throw(errMsg);
			});

	}
	
	 addStaffPipelineData (name1: project_Pipeline): string {
	 
		let body = JSON.stringify({ name1 });
			
		 let headers = new Headers();
		 headers.append('Content-Type', 'application/json');
		 this._http.post(this.baseUrl, body, {
		  headers: headers
		  })
		  .subscribe(
			
		  );
		  
		  return "sss";
	  }
	  
	  
	
	
	
}
