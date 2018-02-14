import { ForecastModel } from './forecast.model';
export class RequestModel {
    empId: number = 0;
	year: string = '';
	region: string = '';
	type: string = '';

	constructor(forecastLeaves: ForecastModel) {
		let keys  = Object.keys(forecastLeaves);
        for(let i=0; i<keys.length; i++){
      	   if(forecastLeaves[keys[i]].length > 0){
      	  	 this.empId = forecastLeaves[keys[i]][0]['empId'];
      	  	 this.year = forecastLeaves[keys[i]][0]['year'];
      	  	 this.region = forecastLeaves[keys[i]][0]['region'];
      	  	 this.type = forecastLeaves[keys[i]][0]['type'];
      	  	 break;
      	  }
        }
	}
}