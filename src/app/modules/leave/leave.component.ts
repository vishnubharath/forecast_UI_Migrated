import { Component, OnInit, NgZone, AfterContentChecked, ViewChild } from '@angular/core';
import { Leave } from './leave';
import { ForecastActualModel } from './models/forecastActual.model';
import { ForeCastService } from './forecast.service';
import { LeaveModel } from './models/leave.model';
import { RequestModel } from './models/request.model';
import { DayModel } from './models/days.model';
declare var jQuery:any;

@Component({
    selector: 'leave-component',
    templateUrl:'app/modules/leave/app.html',
    providers: [ForeCastService]
})
export class LeaveComponent implements OnInit,AfterContentChecked {

    @ViewChild('leaveModal') leaveModal: any;
	errorMessage: any;
	noOfDaysForecast: number;
	noOfDaysActual: string;
	totalMonthsForecast: Array<DayModel>;
    currentForeCast: DayModel;
	monthActual: DayModel;
    msg: string;
	leaves: Leave;
    forecast: ForecastActualModel;
    reqModel: RequestModel;

	constructor(
        private forecastService: ForeCastService, 
        private ngZone: NgZone) {
	}

	ngAfterContentChecked() {
		this.toggleAccordian();
		this.initTabsStyle();
	    this.initDatePickerStyle();
	}
	ngOnInit(){
		this.forecastService
		    .getForecastDetails()
            .subscribe(this.successCallBackOnInit.bind(this),this.errorCallBack);
	}
	dateChanged(date: string, leaveType: string, month: string, source: string) {
        if(leaveType == 'forecast'){
            this.currentForeCast = this.totalMonthsForecast.filter((item)=> item.month === month)[0];
            if(source == 'from'){
                this.currentForeCast.dateFrom = date;
            }else if(source == 'to'){
                this.currentForeCast.dateTo = date;
            }
            if(this.currentForeCast.dateFrom && this.currentForeCast.dateTo){
                this.calculateDays(this.currentForeCast);
            }
        }else if(leaveType == 'actual'){
            if(source == 'from'){
                this.monthActual.dateFrom = date;
            }else if(source == 'to'){
                this.monthActual.dateTo = date;
            }
            if(this.monthActual.dateFrom && this.monthActual.dateTo){
                this.calculateDays(this.monthActual);
            }
        }
    }
    addLeave(leaveType: string, month: string) {
        if(leaveType == 'forecast'){
            let leave = this.addToForecastActualRow(this.currentForeCast);
            if(leave){
              this.forecast.forecastLeaves[month].push(leave);
              this.resetAfterAdd(this.currentForeCast);   
            }
        }else if(leaveType == 'actual'){
            let leave = this.addToForecastActualRow(this.monthActual);
            if(leave){
              this.forecast.actualleaves.push(leave);
              this.resetAfterAdd(this.monthActual);   
            }
        }
        console.log(this.forecast);
    }
    
    removeLeave(eachForecastLeave: LeaveModel, leaveType: string) {
    	this.forecast.removeLeaveObj(eachForecastLeave, leaveType);
    }
    saveForecast() {
    	this.forecastService
		    .saveForecastDetails(this.forecast.forecastLeaves)
            .subscribe(this.successCallBack.bind(this),this.errorCallBack);
    }
    saveActual() {
    	this.forecastService
		    .saveActualDetails(this.forecast.actualleaves)
            .subscribe(this.successCallBack.bind(this),this.errorCallBack);
    }
    private addToForecastActualRow(model: DayModel): LeaveModel {
        if(!model || !model.totalNoOFDays){
            this.leaveModal.open();
            this.msg = 'Please enter vaild date';
            return;
        }
        let leave = new LeaveModel(
            model.dateFrom, 
            model.dateTo, 
            model.totalNoOFDays, 
            model.month, 
            this.reqModel);
        return leave;
    }
    private resetAfterAdd(model: DayModel) {
        model.dateFrom = null;
        model.dateTo = null;
        model.totalNoOFDays = null;
    }
    private successCallBackOnInit(data:any) {
    	this.ngZone.run(() => {
            this.forecast = new ForecastActualModel(data);
    		this.totalMonthsForecast = this.forecast.forecastLeaves
    		                       .getNoOfMonthsForecast(this.forecast['forecastLeaves']);
    		this.monthActual = this.forecast.forecastLeaves
    		                       .getNoOfMonthsActual(this.forecast['actualleaves']);
            this.reqModel = new RequestModel(this.forecast['forecastLeaves']);
            console.log(this.totalMonthsForecast);
        });

    }
    private successCallBack(data:any) {
        this.leaveModal.open();
        this.msg = data.message;
    }
    private errorCallBack(error:any) {
      console.log(error);
    }
    private calculateDays(model: DayModel) {
        let from  = model.dateFrom;
        let to = model.dateTo;
        let totalDay = parseInt(to.split('-')[2],10) - parseInt(from.split('-')[2],10);
        if(totalDay <= 0){
            this.leaveModal.open();
            this.msg = 'Please enter vaild date';
            return;
        }
        model.totalNoOFDays = totalDay.toString();
    }
	private toggleAccordian() {
		jQuery('.collapse.in').prev('.panel-heading').addClass('active');
	    jQuery('#accordion, #bs-collapse')
	    .on('show.bs.collapse', function(a:any) {
	       jQuery(a.target).prev('.panel-heading').addClass('active');
	    })
	    .on('hide.bs.collapse', function(a:any) {
	       jQuery(a.target).prev('.panel-heading').removeClass('active');
	    }); 
	}
	private initTabsStyle() {
		jQuery('.tab ul.tabs').addClass('active').find('> li:eq(0)').addClass('current');
	    jQuery('.tab ul.tabs li a').click(function (g:any) { 
			var tab = jQuery(this).closest('.tab'), 
				index = jQuery(this).closest('li').index();
			tab.find('ul.tabs > li').removeClass('current');
			jQuery(this).closest('li').addClass('current');
			tab.find('.tab_content').find('div.tabs_item').not('div.tabs_item:eq(' + index + ')').slideUp();
			tab.find('.tab_content').find('div.tabs_item:eq(' + index + ')').slideDown();
			g.preventDefault();
	  });

	}
	private initDatePickerStyle() {
		jQuery('.datepicker__input').addClass('form-control');
	    jQuery('.datepicker__input').removeAttr("style");
	}
}



