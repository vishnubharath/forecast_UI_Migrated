import { Component, OnInit } from '@angular/core';
import { Constants } from './../constants/constants';
import {Http, Response, Headers, RequestOptions, URLSearchParams} from "@angular/http";

@Component({
  selector: 'health-check',
  template: `<h1><button (click)="check()">Check Again</button>Reports Health : {{reportshealth}}</h1>`,
})
export class HealthCheck implements OnInit {

  reportshealth:string = "Checking...";

  constructor(private _http: Http){}

  ngOnInit() {
      this._http.get(Constants.base_url+"reports/healthcheck").subscribe(data => this.reportshealth = data + "");
  }
  check(){
    this._http.get(Constants.base_url+"reports/healthcheck").subscribe(data => this.reportshealth = data + "");
  }
}
