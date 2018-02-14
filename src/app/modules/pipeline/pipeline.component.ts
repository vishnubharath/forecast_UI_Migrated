import { Component,OnInit } from '@angular/core';
import {ElementRef}  from '@angular/core';
import {staff_Pipeline} from './staff_pipeline'
import {staffList_Pipeline} from './staffList_pipelineVo'
import {MenuItem} from 'primeng/components/common/api';
import { ActivatedRoute, Params } from '@angular/router';
import {StaffPipelineService} from './service.staffpipeline';


@Component({
    selector: 'pipeLineComponent',
    templateUrl:'app/modules/pipeline/stafingpipeline.html'

})
export class PipeLineComponent {
	    private items: MenuItem[]; // menu items  
		pageTypeFlag:number; // determine page type in menu
		start:number; //incoming value for both page type
		end:number;	//incoming value for both page type
		count:number=1; // to determine sno.
		errorMessage: any; //error message 
		staffFromService:boolean;// flag set to true when value need to be fetched from service
		displayDialog: boolean;// enable dialog box to load once this field is set to true
		newStaff: staff_Pipeline;// used when add button is clicked in UI 
		selectedStaff: staff_Pipeline;// holds selected staff 
		newStaffFlag: boolean;//used to distinguish between new and existing staff during save operation
		newStaffingPage: boolean;// enable new staff specific dialog box to load once this field is set to true
		totHeaders:string[]=['Jan','Feb','Mar','Apr','May','June','July','Aug','Sep','Oct','Nov','Dec'];// default headers
		dumList:number[]=[undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined];
		allStaffs:staff_Pipeline[];
		dumheaders:string[];
		staffList:staffList_Pipeline;
		
		//baseUrl:string="http://localhost:8080/forecast-1.0.0-SNAPSHOT/testing/";
		baseUrl:string="http://localhost:8080/forecast-1.0.0-SNAPSHOT/pipeline/get/staffing/"
		
			constructor(
				private route: ActivatedRoute,private _staffService: StaffPipelineService

			) {}
  
			//Menu bar
			ngOnInit() {
					 this.route.params.forEach((params: Params) => {
						this.pageTypeFlag = +params['id'];
					});
				
				
				//load with menu items
					this.items = [
						{
							label: 'View',
							items: [{label: 'Create New Staffing Page',icon: 'newStaff',routerLink: ['/pipeLineModule', "1"]},
									{label: 'View History Staffing Page',icon: 'newStaff',routerLink: ['/pipeLineModule', "2"]},
									{label: 'Create New Project Staffing Page',icon: 'oldStaff',routerLink: ['/projectPipeLineComponent',"1"]},
									{label: 'View History Project Staffing Page',icon: 'newStaff',routerLink: ['/projectPipeLineComponent', "2"]},

									{label: 'Upload Staffing Page',icon: 'fa-plus',routerLink: ['/uploadModule']},]
						}
						
					];
					if(this.pageTypeFlag==1){
								this.newStaffingPage=true;
					}
					if(this.pageTypeFlag==2){
								this.staffFromService=true;
					} 
				
				}


				//proceed available in the menu will create new page with single row 
				proceed(){

						document.getElementById("newStaff").style.display = "block";
						this.newStaffingPage=false;
						this.dumheaders = this.totHeaders.slice(this.start-1,this.end);
						
						
							this.allStaffs=[
								{ 	sNo:1,
									name:'',
									division:'',
									noOfResources:undefined,
									headers:this.dumheaders,
									values:this.dumList.slice(this.start-1,this.end)
								}
							] 
				
				}
				// service call with data and month as parameters
				getHistory(){
					document.getElementById("newStaff").style.display = "block";
								this.staffFromService=false;

							this._staffService.getStaffPipelineData(this.baseUrl+this.start+this.end).then(
								result=>this.allStaffs=result,
								error =>  this.errorMessage = <any>error
							);
					
				}
				
				cloneStaffDetails(c: staff_Pipeline): staff_Pipeline {
							 
					return c;
				}
	
	
				//once a row is selected
				onRowSelect(event) {
					this.newStaffFlag = false;
					this.newStaff = this.cloneStaffDetails(event.data);
					this.displayDialog = true;
				}
	
				// identify the selected staff by index
				findSelectedStaffIndex(): number {
					return this.allStaffs.indexOf(this.selectedStaff);
				}
				//dialog box enable user to add new staff
				 showDialogToAdd() {
					
					if(this.count<this.allStaffs.length){
						this.count = this.allStaffs.length+1;
					}
					this.newStaffFlag = true;
					document.getElementById("delete").style.display = "none";

					this.newStaff = 
						{	sNo:this.count,
							name:'',
							division:'',
							noOfResources:undefined,
							values :this.dumList.slice(this.start-1,this.end),
							headers:this.allStaffs[0].headers
						};
					this.displayDialog = true;
				}
				//save call to service
				save() {
				
					if(this.newStaffFlag){
						this.allStaffs.push(this.newStaff);
						
						
						this.staffList = {
							staffingList:this.allStaffs,
							Month:this.end
						};
						
						this._staffService.addStaffPipelineData(this.staffList);
						this.count++;
						}
					else
						this.allStaffs[this.findSelectedStaffIndex()] = this.newStaff;
					
					this.newStaff = null;
					this.displayDialog = false;
				}
				//delete call to service with staff details.	
				delete() {
					this.allStaffs.splice(this.findSelectedStaffIndex(), 1);
					this.newStaff = null;
					this.displayDialog = false;
				}    
	
   
}