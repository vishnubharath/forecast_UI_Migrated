 import { Component,OnInit } from '@angular/core';
import {ElementRef}  from '@angular/core';
import {project_Pipeline} from './project_pipeline';
import {MenuItem} from 'primeng/components/common/api';
import { ActivatedRoute, Params } from '@angular/router';
import {ProjectPipelineService} from './service.projectpipeline';


@Component({
    selector: 'projectpipeLineComponent',
    templateUrl:'app/modules/pipeline/projectpipeline.html'
})
export class ProjectPipeLineComponent {
	displayDialog: boolean;// enable dialog box to load once this field is set to true
    newStaff: project_Pipeline;// used when add button is clicked in UI 
    selectedStaff: project_Pipeline;// holds selected staff 
    newStaffFlag: boolean;//used to distinguish between new and existing staff during save operation
    newStaffingPage: boolean;
	errorMessage: any; //error message 
    projectFromService: boolean;
    pageTypeFlag:number;
	start:number;
	end:number;
	dumheaders:string[];
	totHeaders:string[]=['Jan','Feb','Mar','Apr','May','June','July','Aug','Sep','Oct','Nov','Dec'];// default headers
	dumList:number[]=[undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined];
	count:number=1;
	baseUrl:string="http://localhost:8080/forecast-1.0.0-SNAPSHOT/testing/";
	allStaffs:project_Pipeline[];
		

		constructor(
			private route: ActivatedRoute,private _project_Pipeline: ProjectPipelineService

		) {}
  

		ngOnInit() {
				 this.route.params.forEach((params: Params) => {
			  this.pageTypeFlag = +params['id'];
		});
       
			if(this.pageTypeFlag==1){
			
				this.newStaffingPage=true;
				
			} 
			if(this.pageTypeFlag==2){
			
				this.projectFromService=true;
			} 
	
		}
	
		//proceed available in the menu will create new page with single row 
		proceed(){

			document.getElementById("newStaff").style.display = "block";
			this.newStaffingPage=false;
			this.dumheaders = this.totHeaders.slice(this.start-1,this.end);
			
			console.log(this.dumheaders);
			 this.allStaffs=[
						{sno:this.count++,
						lob:'',
						opportunityname:'',
						contact:'',
						salesstage:'',
						estCloseDate :'',
						headers:this.dumheaders,
						list:this.dumList.slice(this.start-1,this.end),
						tcv:undefined,
						probability:'',
						practiseinvolved:'',
						header:['2017$']
						}
					];
				
		}

		 cloneStaffDetails(c: project_Pipeline): project_Pipeline {
					 
			return c;
		}
		
		// service call with data and month as parameters
		getHistory(){
			document.getElementById("newStaff").style.display = "block";
				this.projectFromService=false;

			this._project_Pipeline.getStaffPipelineData(this.baseUrl+this.start+"/"+this.end).then(
				result=>this.allStaffs=result,
				error =>  this.errorMessage = <any>error
			);
					
		}
				
		onRowSelect(event) {
			this.newStaffFlag = false;
			this.newStaff = this.cloneStaffDetails(event.data);
			this.displayDialog = true;
		}
		
		findSelectedStaffIndex(): number {
			return this.allStaffs.indexOf(this.selectedStaff);
		}
	 
		 showDialogToAdd() {
				this.newStaffFlag = true;
				document.getElementById("delete").style.display = "none";

				this.newStaff = 
			{	sno:this.count,
				lob:'',
				opportunityname:'',
				contact:'',
				salesstage:'',
				estCloseDate :'',
				headers:this.allStaffs[0].headers,
				list:this.dumList.slice(this.start-1,this.end),	
				tcv:undefined,
				probability:'',
				practiseinvolved:'',
				header:['2017$']
			};
				this.displayDialog = true;
		}
	save() {
	
        if(this.newStaffFlag){
            this.allStaffs.push(this.newStaff);
			this.count++;
			}
        else
            this.allStaffs[this.findSelectedStaffIndex()] = this.newStaff;
        
        this.newStaff = null;
        this.displayDialog = false;
    }
    
    delete() {
        this.allStaffs.splice(this.findSelectedStaffIndex(), 1);
        this.newStaff = null;
        this.displayDialog = false;
    }    
	
	
	
	}
	
	
	
	
	
	
	
	
	
	
	
	

	
	
	
	
	

