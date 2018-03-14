import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import 'rxjs/Rx';
import { Observable }     from 'rxjs/Observable';
import { Constants } from '../Constant/constants';
import { Report } from './report';
import { error } from 'util';
import {Project } from './Project'

@Injectable()
export class ProjectService{
	choosenProject:Array<Project> = new Array<Project>();
	
	constructor(private _http:Http){
		
	}

	getAllProjects():Observable<Project[]>{
		return this._http
		.get(Constants.base_url+'projects/all' )
		.map((res:Response) => res.json())
		.catch(error=>{
			let errMsg = (error.message) ? error.message :
				error.status ? `${error.status} - ${error.statusText}` : 'Server error';
			console.error(errMsg); // log to console instead
			return Observable.throw(errMsg);
		});
	}

	choosenProjectlist(choosenProject:Array<Project>){
		this.choosenProject=choosenProject
	}
	getChoosenProjectlist(){
		return this.choosenProject;
	}
	
	
}