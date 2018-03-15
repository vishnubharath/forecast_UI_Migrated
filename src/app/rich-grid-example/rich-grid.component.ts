import { Component, ViewEncapsulation, Inject, ViewContainerRef } from "@angular/core";
import { GridOptions } from "ag-grid/main";
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';

import {MatChipInputEvent} from '@angular/material';
import {ENTER, COMMA} from '@angular/cdk/keycodes';

import ProficiencyFilter from '../filters/proficiencyFilter';



// only import this if you are using the ag-Grid-Enterprise
import 'ag-grid-enterprise/main';

import { HeaderGroupComponent } from "../header-group-component/header-group.component";
import { DateComponent } from "../date-component/date.component";
import { HeaderComponent } from "../header-component/header.component";
import { ReportService } from "../Report/report.service";
import { ProjectService } from "../Report/project.service";
import { Report } from "../Report/report";
import { ReportType } from "../Report/ReportType";
import { Adjustment } from "../Report/Adjustments";
import { Project } from "../Report/Project";
//import { UpdateReportDialog } from "../Dialog/update-report-dialog.component";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { ReportAdjusment } from "../Report/reportAdjusments";
import { ToastsManager } from 'ng2-toastr';
import { Utils } from "../Constant/Utils";
@Component({
    selector: 'rich-grid',
    templateUrl: 'rich-grid.component.html',
    styleUrls: ['rich-grid.css', 'proficiency-renderer.css'],
    encapsulation: ViewEncapsulation.None
})
export class RichGridComponent {

    private gridOptions: GridOptions;
    public showGrid: boolean;
    public serviceRowData: Report[];
    public projects: Project[];
    public filteredProjects: Project[];
    public filteredProjectsObs : Observable<any[]>;
    public chosenProject:Array<Project> = new Array<Project>();
    public chosenProjectArray:Array<String> = new Array<String>();
    public rowData: ReportType[];
    private columnDefs: any[];
    public rowCount: string;
    public dateComponentFramework: DateComponent;
    public HeaderGroupComponent = HeaderGroupComponent;
    public _reportservice: ReportService;
    public _projectService: ProjectService;
    public hideprogress: boolean = true;
    private updatedValues: Adjustment[] = [];
    private updatedRowData: ReportType[] = [];
    public selectedRow:boolean=false;
    public addNewRow:boolean=false;
    public selectedRowIndex;
    public editable:boolean=false;
    public showALLChip:boolean=false;
    public  duplicaterowData: ReportType[]=[];
    //public parentRowData: ReportType[]=[];
    public  errorData: ReportType[]=[];
    public  parentRowData = new Map();
    private rowClassRules;
    // private postProcessPopup;
    // private getMainMenuItems;
    private defaultColDef;
    //Controls
    projectCtrl: FormControl;
   
    public addRowData: ReportType;

    // Chips Config
    selectable: boolean = true;
    removable: boolean = true;
    //addOnBlur: boolean = true;
    // Enter, comma
    separatorKeysCodes = [ENTER, COMMA];

    private overlayNoRowsTemplate; 
    
    constructor(_reportservice: ReportService, _projectService: ProjectService,public dialog: MatDialog,public toastr: ToastsManager, vcr: ViewContainerRef ) {
        // we pass an empty gridOptions in, so we can grab the api out
        this.toastr.setRootViewContainerRef(vcr);
       // this. toastr.op = { positionClass: 'toast-bottom-right' }
        this._reportservice = _reportservice;
        this._projectService = _projectService;
        this.overlayNoRowsTemplate = "<span style=\"padding: 10px; border: 1px solid #fff; background: #E57373; color: white; border-radius: 10px;\">Please filter by Projects option(in top left) to view Reports data</span>"; 
        this.gridOptions = <GridOptions>{};
        this.defaultColDef = {
            enableValue: true,
            enableRowGroup: true,
            enablePivot: true
          };
        this.createRowData();
        this.createColumnDefs();
        this.showGrid = true;
        this.addNewRow=true;
        
        this.gridOptions.dateComponentFramework = DateComponent;
        this.gridOptions.defaultColDef = {
            editable: false,
            width: 100,
            headerComponentFramework: <{ new(): HeaderComponent }>HeaderComponent,
            headerComponentParams: {
                menuIcon: 'fa-bars'
            }
        }

        //Control
        this.projectCtrl = new FormControl();
        this.projectCtrl.valueChanges.subscribe( value => { 
            console.log("test .."  + value) 
            
            this.filteredProjects = this.projects.filter(project =>
                project.projectName.toLowerCase().indexOf((value + "").toLowerCase()) !== -1 );
              
            this.filteredProjectsObs = new Observable<Project[]>(
                observer => {
                    observer.next(this.filteredProjects);
                }

            );
        });


        this.rowClassRules = {
            "duplicated-row": function(params){
                console.log();
                if(params.data!=undefined){
                    return params.data.reportId===undefined;
                }
            }
            // "duplicated_row_error": function(params){
            //     if(params.data.reportId===undefined){
            //             return true;
            //     }
            //     return false
            // }
            

          };
        //   this.postProcessPopup = function(params) {
        //     if (params.type !== "columnMenu") {
        //       return;
        //     }
        //     var columnId = params.column.getId();
        //     if (columnId === "gold") {
        //       var ePopup = params.ePopup;
        //       var oldTopStr = ePopup.style.top;
        //       oldTopStr = oldTopStr.substring(0, oldTopStr.indexOf("px"));
        //       var oldTop = parseInt(oldTopStr);
        //       var newTop = oldTop + 25;
        //       ePopup.style.top = newTop + "px";
        //     }
        //   };

        //   this.getMainMenuItems = function getMainMenuItems(params) {
        //     switch (params.column.getId()) {
              
        //       default:
        //         return params.defaultItems;
        //     }
        //   };
         // this.toastr.info('Please choose projects for querying','Please Choose Projects');
          this.rowData=[];
    }

   
    private createRowData() {
        console.log("enter into create Row data");
        //this.hideprogress = false;
        this.addNewRow=true;
        this.duplicaterowData=[];
        this.errorData=[];
        this.updatedRowData=[];
        this.selectedRow=false;
        this.selectedRowIndex="";

        this._projectService.getAllProjects().subscribe(projects => {
            this.projects = projects;
            console.log("projects ");
            console.log(projects);
            
        },error=>{
            this.toastr.error(error,"Error");
        });

        console.log("inside the create row data" + this.rowData)
    }
    private createDynamicColumn(reportdata:Report){
        console.log("Length of the record"+reportdata.reportAdjustmentEntity.length)
               
        this.columnDefs=[];
        this.createColumnDefs();
                for(let i=0;i<reportdata.reportAdjustmentEntity.length;i++){
    
              var params=  {
                        headerName: reportdata.reportAdjustmentEntity[i].forecastedMonth +"- "+reportdata.reportAdjustmentEntity[i].forecastedYear,
        
                        children: [
                            {
                                headerName: "Hours", field: "hours_"+[i+1], sortingOrder: ["asc", "desc"],filter: "agTextColumnFilter",
                                width: 150, pinned: false, editable: true
                            },
                            {
                                headerName: "Adjustment", field: "adjustment_"+[i+1], filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
                                width: 150, pinned: false, editable: true
                            },
                            {
                                headerName: "Rate", field: "rate_"+[i+1], filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
                                width: 150, pinned: false, editable: true
                            },
                            {
                                headerName: "Revenue", valueGetter: function aPlusBValueGetter(params) {
                                    let hours=params.data["hours_"+[i+1]];
                                    let adjustment=params.data["adjustment_"+[i+1]];
                                    let rate=params.data["rate_"+[i+1]];
                                    params.data["revenue_"+[i+1]]=(hours - adjustment) * rate;
                                    return params.data["revenue_"+[i+1]];
                                }, filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
                                width: 150, pinned: false, valueFormatter: function RevenueFormater(params) {
                                    return "CAD" + " " + params.data["revenue_"+[i+1]].toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                                }
                            }
                        ]
                    }
                    this.columnDefs.push(params);   
            }
            this.gridOptions.api.setColumnDefs(this.columnDefs);
            this.gridOptions.api.redrawRows();
        }
    private createColumnDefs() {
        this.columnDefs = [
            {
                headerName: '#', width: 30, checkboxSelection: true, suppressSorting: true,
                suppressMenu: true, pinned: true
            },
            {
                headerName: 'Employee ',

                children: [
                    {
                        headerName: "Associate ID", field: "associateId", filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false
                    },
                    {
                        headerName: "Associate Name", field: "associateName", filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
                        width: 150, pinned: true
                    },
                    {
                        headerName: "HR Grade", field: "associateGrade", filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false
                    },
                    {
                        headerName: "Location", field: "location", filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false,editable:true,cellEditor: "agSelectCellEditor",
                        cellEditorParams: {
                          values: ["Onsite","Offshore"]
                        },
                        
                    },
                    {
                        headerName: "City", field: "city", filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false,editable:true,cellEditor: "agSelectCellEditor",
                        cellEditorParams: {
                          values: ["CHENNAI","KOLKATA","LONDON","NEWYORK","PUNE","TORONTO"]
                        },
                    },
                    {
                        headerName: "Billability", field: "billability", filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false
                    },

                ]
            },
            {
                headerName: 'Project ',

                children: [
                    {
                        headerName: "Customer ID", field: "customerId", filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false
                    },
                    {
                        headerName: "Customer Name", field: "customerName", filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
                        width: 150
                    },
                    {
                        headerName: "Project ID", field: "projectId", filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
                        width: 150, pinner: false
                    },
                    {
                        headerName: "Project Name", field: "projectName", filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
                        width: 150, pinned: true
                    },
                    {
                        headerName: "Allocation StartDate", field: "allocStartDate", filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
                        width: 150
                    },
                    {
                        headerName: "Allocation Enddate", field: "allocEndDate", filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
                        width: 150
                    },
                    {
                        headerName: "Allocation Percentage", field: "allocationPercentage", filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
                        width: 150
                    },
                    {
                        headerName: "Portfolio", field: "portfolio", filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
                        width: 150
                    },
                    {
                        headerName: "POCs", field: "poc", filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
                        width: 150
                    },
                    {
                        headerName: "Project Billability", field: "projectBillability", filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
                        width: 150
                    },
                ]
            }

        ];
    }

    private calculateRowCount() {
        if (this.gridOptions.api && this.rowData) {
            var model = this.gridOptions.api.getModel();
            var totalRows = this.rowData.length;
            var processedRows = model.getRowCount();
            this.rowCount = processedRows.toLocaleString() + ' / ' + totalRows.toLocaleString();
        }
    }

    private onModelUpdated() {
        console.log('onModelUpdated');
        this.calculateRowCount();
    }

    public onReady() {
        console.log('onReady');
        this.calculateRowCount();
    }

    private onCellClicked($event) {
        console.log('onCellClicked: ' + $event.rowIndex + ' ' + $event.colDef.field);
        if($event.rowIndex!=this.selectedRowIndex){
            this.editable=false;
        }
    }

    private onCellValueChanged($event) {


        var col_number = $event.colDef.field.split("_")[1];
        var idFiled = "adjustment_" + col_number + "_id";
        var adjustment = "adjustment_" + col_number;
        var hoursFiled = "hours_" + col_number;
        var rateFiled = "rate_" + col_number;

        console.log("data..");
        console.log("field name : " + $event.colDef.field);
        console.log("project id :" + $event.node.data.reportId);
        console.log("adj val : " + $event.node.data[adjustment]);
        console.log("adj id : " + $event.node.data[idFiled]);
        console.log("hours : " + $event.node.data[hoursFiled]);
        console.log("rate : " + $event.node.data[rateFiled]);
        console.log("project id : " + $event.node.data["projectId"]);
        console.log("associate id : " + $event.node.data["associateId"]);


        console.log(this.updatedValues);


        if($event.node.data.reportId!=undefined && ($event.colDef.field.split("_")[0]==="location" ||$event.colDef.field.split("_")[0]==="city")&& ($event.oldValue!=$event.newValue)){
            this.toastr.error("Location Type & Associate City can be updated only for duplicate Records!!");
            $event.node.data[$event.colDef.field.split("_")[0]]=$event.oldValue;
            this.gridOptions.api.refreshCells({columns:['location','city']})
           // return;
        }else if($event.node.data.reportId===undefined){
            // if (this.duplicaterowData.filter(data => $event.node.data[idFiled] === data).length > 0) {
                 console.log("Duplicate record changes..");
                 this.duplicaterowData.forEach(data => {
                     if (data.associateId === $event.node.data["associateId"] && data.projectId === $event.node.data["projectId"]) {
                         data[$event.colDef.field]=$event.newValue;
                     }
                 });
          //   }
         }else if (this.updatedRowData.filter(data => $event.node.data[idFiled] === data[idFiled]).length > 0) {
            console.log("containts..");
            this.updatedRowData.forEach(data => {
                if (data[idFiled] === $event.node.data[idFiled]) {
                   
                    data[$event.colDef.field]=$event.newValue;
                }
            });
        } else {
            console.log("push..");
            var newValueChanges: Adjustment = new Adjustment();
           
           console.log($event.node.data);
           var tmp =$event.node.data;
            tmp.reportDataType="Update";
            this.updatedRowData.push(tmp);
            console.log(this.updatedRowData);
            this.addNewRow=false;
           
        }

        console.log(this.updatedValues);
 
        console.log('onCellValueChanged: ' + $event.oldValue + ' to ' + $event.newValue + ' ' + $event.rowIndex + ' ' + $event.node.data.projectId + " " + $event.node.data.projectName);
       
        if($event.colDef.field.split("_")[0]==='rate'){
            let columnsName:string[]=[];     
            for(let i=col_number;i<=Utils.numberOfMonths;i++){
                $event.node.data["rate_"+i]=$event.newValue;
                let hours=$event.node.data["hours_"+[i]];
                let adjustment=$event.node.data["adjustment_"+[i]];
                let rate=$event.newValue;
                $event.node.data["revenue_"+[i]]=(hours - adjustment) * rate;
                columnsName.push("rate_"+i);
                columnsName.push("revenue_"+i);
                columnsName.push("hours_"+i);
            }
           // this.gridOptions.api.updateRowData({ update: $event.node.data });
           this.gridOptions.api.refreshCells({columns:columnsName})
           console.log($event.node.data);
        }
    }

    private onCellDoubleClicked($event) {
        console.log('onCellDoubleClicked: ' + $event.rowIndex + ' ' + $event.colDef.field);
    }

    private onCellContextMenu($event) {
        console.log('onCellContextMenu: ' + $event.rowIndex + ' ' + $event.colDef.field);
    }

    private onCellFocused($event) {
        console.log('onCellFocused: (' + $event.rowIndex + ',' + $event.colIndex + ')');
    }

    private onRowSelected($event) {
        // taking out, as when we 'select all', it prints to much to the console!!
        // console.log('onRowSelected: ' + $event.node.data.name);
    }

    private onSelectionChanged() {
        console.log('selectionChanged');
        this.editable=true
        if(this.gridOptions.api.getSelectedRows().length>0){
            this.selectedRow=true;
            this.selectedRowIndex=this.gridOptions.api.getSelectedNodes()[0].childIndex;
        }else{
            this.selectedRow=false;
            this.selectedRowIndex="";
        }
    }

    private onBeforeFilterChanged() {
        console.log('beforeFilterChanged');
    }

    private onAfterFilterChanged() {
        console.log('afterFilterChanged');
    }

    private onFilterModified() {
        console.log('onFilterModified');
    }

    private onBeforeSortChanged() {
        console.log('onBeforeSortChanged');
    }

    private onAfterSortChanged() {
        console.log('onAfterSortChanged');
    }

    private onVirtualRowRemoved($event) {
        // because this event gets fired LOTS of times, we don't print it to the
        // console. if you want to see it, just uncomment out this line
        // console.log('onVirtualRowRemoved: ' + $event.rowIndex);
    }

    private onRowClicked($event) {
        console.log('onRowClicked: ' + $event.node.data.name);
    }

    public onQuickFilterChanged($event) {
        this.gridOptions.api.setQuickFilter($event.target.value);
    }

    // here we use one generic event to handle all the column type events.
    // the method just prints the event name
    private onColumnEvent($event) {
        console.log('onColumnEvent: ' + $event);
    }

    public saveUpdated() {
        this.hideprogress = false;
        
      //  if(this.duplicaterowData.length>0){
            let isParentCopy:Boolean;
            var errormsg="";
            this.duplicaterowData.forEach(data=>{
                if(this.parentRowData.has(data.associateId+"-"+data.projectId+"-"+data.location)){
                    this.errorData.push(data);
                }
            });
            if( this.errorData.length===0 ){
                if((this.updatedRowData.length>0 || this.duplicaterowData.length>0)){
                    this.updatedRowData.forEach(rowData=>{
                        this.duplicaterowData.push(rowData);
                    });
                    //Final Data send to server 
                    console.log("Final data");
                    console.log(this.duplicaterowData);
                    
                    // if(this.duplicaterowData.length>0){
                        this._reportservice.finalReportSave(this.duplicaterowData).subscribe(data => {
                            this.hideprogress = true;
                            this.duplicaterowData=[];
                            this.errorData=[];
                            this.updatedRowData=[];
                            this.addNewRow=true;
                            this.getReports();
                            this.toastr.success("Data Saved","success");
                        },err => { console.log(err); 
                            this.toastr.error(err,"Error");
                            this.hideprogress = true;
                         });
                    // }
                    
                }else{
                    this.toastr.warning("Nothing to save","Warning");
                    this.hideprogress = true;
                }
                
            }else{
                //aleart box
                console.log("Error data ");
                console.log(this.errorData);
                errormsg="Records are already available for below combination(Associate Id - Project Id - Location Type).\n\n Please validate below records in list \n\n\n************************ \n\n";
                this.errorData.forEach(data=>{
                    errormsg=errormsg+data.associateId+"-"+data.projectId+"-"+data.location+"\n ";
                });
                errormsg= errormsg+'\n\n************************'
                this.toastr.error(errormsg, 'Error!');
               this.errorData = [];
               this.hideprogress = true;
                
            }
            //color part
            console.log(this.duplicaterowData);
      
    }
    onBtExport() {
        var params = {
            skipHeader: false,
            columnGroups: true,
            fileName: "ForeCaseReport",
            sheetName: "Sheet 1"
          };
        this.gridOptions.api.exportDataAsExcel(params);
      }

    //   showSuccess() {
    //       console.log(this.chosenProject);
    //       console.log(this.projects);
          
          
    //     this.toastr.success('You are awesome!', 'Success!');
    //   }

   


    onDuplicateRow(){
        if(this.selectedRow){
            console.log(this.gridOptions.api.getSelectedRows());
            
          var rowData_record: ReportType[]   = new Utils().createDuplicateRow(this.gridOptions.api.getSelectedRows(),false);
          rowData_record[0].reportDataType="duplicate";
         
          console.log("duplicated data check");
          console.log(rowData_record);
          this.duplicaterowData.push(rowData_record[0]);
          this.parentRowData.set(rowData_record[0].associateId+"-"+rowData_record[0].projectId+"-"+rowData_record[0].location,rowData_record[0]);
          this.gridOptions.api.updateRowData({ add: rowData_record,addIndex: this.selectedRowIndex+1 });
          rowData_record=null;
          
          this.toastr.success('Data Duplicated', 'Success!');
        }
      console.log("data from duplicate "+this.duplicaterowData);
      console.log(this.duplicaterowData);
      
      
    }

    onDeleteRow(){
        var rowData_record: ReportType[]   = new Utils().createDuplicateRow(this.gridOptions.api.getSelectedRows(),true);
        if((rowData_record[0].reportId ===undefined)||(this.selectedRow && this.duplicaterowData.length==0 && this.updatedRowData.length==0 && this.errorData.length==0 )){
            
            if(rowData_record[0].reportId!=undefined){
                this.hideprogress = false;
                console.log("inside if condition ");
                this._reportservice.deleteReport(rowData_record).subscribe(result => {
                    console.log(result);
                    this.toastr.success('Data Deleted', 'Success!');
                    //this.createRowData();
                    this.selectedRow=false;
                    this.selectedRowIndex="";
                    this.getReports();
                    this.hideprogress = true;
                },error=>{
                    this.toastr.error(error, 'Error!');
                    this.hideprogress = true;
                });
            }else{
                this.hideprogress = false;
                var selectedData = this.gridOptions.api.getSelectedRows();
                this.gridOptions.api.updateRowData({ remove: selectedData });
                var index=this.duplicaterowData.indexOf(selectedData[0]);
                console.log(this.duplicaterowData);
                this.duplicaterowData.splice(index,1);
                console.log("from delete else part");
                console.log(this.duplicaterowData);
                this.hideprogress = true;
                this.toastr.success('Data Deleted', 'Success!');
            }
            
        } else{
            this.toastr.error('Please save unsaved data before proceeding with delete to prevent data loss!! ', 'Error');
        }
    }
    

   

  

  openDialog(): void {
      if(this.rowData.length===0){
        this.toastr.warning('Please choose any project before adding New Row data!!');
      }else if(this.duplicaterowData.length===0 && this.errorData.length===0 && this.updatedRowData.length===0 ){
          console.log("inside opendialog");
          
          if(this.addRowData===undefined){
            this.addRowData=new ReportType();
          }
        this.addRowData.reportDataType="NewData";
        let dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
            width: '75%',
            data:  this.addRowData
          });
      
          dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
             // console.log(result.from);
              this.addRowData=result;
              console.log(result);
              
            //console.log(this._reportservice.convertNewData(result));
          
            //   var reports:ReportType[]  = this._reportservice.convertNewData(result);
            //   var costing:Boolean=false;
            //   var serviceRowData: Report[]=this._reportservice.convertFinalReport(reports);
            //   for(let i=0;i<serviceRowData[0].reportAdjustmentEntity.length;i++){
            //       if(serviceRowData[0].reportAdjustmentEntity[i].hours!=undefined || serviceRowData[0].reportAdjustmentEntity[i].rate!=undefined || serviceRowData[0].reportAdjustmentEntity[i].adjustment!=undefined   ){
            //         costing=true;
            //         break;
            //       }
            //   }
                // console.log(this._reportservice.convertFinalReport(reports)[0].reportAdjustmentEntity.length);
            //   if(costing){
                if( (result!=undefined) &&(result.from==="save")){
                    this._reportservice.finalReportSave(this._reportservice.convertNewData(result)).subscribe(resp=>{
                        this.toastr.success('Data Added', 'Success!'); 
                        this.getReports();
                        this.addRowData=new ReportType()
                    },error=>{
                      this.toastr.error(error, 'Error!');
                   });
                  }
            //   }else{
            //     this.toastr.error('Please enter Costing Data of any one month to proceed for addition of new report record.'); 
            //   }
           
        });
      }else{
        this.toastr.error('Please save unsaved data before adding new data to prevent data loss!! ', 'Error');
      }
    
  }

  add(event: MatChipInputEvent): void {
    this.showALLChip = false;
    let input = event.input;
    let value = event.value;
  
    // Add our fruit
    if ((value || '').trim()) {
      
      
      
      let project  = this.projects.filter( proj => proj.projectId + "" === value )[0];

      if(project) {
        this.projects = this.projects.filter( proj => proj.projectId + "" != value );
        this.chosenProject.push(project);
        this._projectService.choosenProjectlist(this.chosenProject);
        this.getReports();
      } 
    }
  
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }
  
  remove(project: any): void {
    let index = this.chosenProject.indexOf(project);
  
    if (index >= 0) {
      this.chosenProject.splice(index, 1);
      this._projectService.choosenProjectlist(this.chosenProject);
      this._projectService
      this.projects.push(project)
      this.getReports();
    }
  }

  autoComplete(projectSelected:any){
    this.showALLChip = false;
    this.projectCtrl.setValue("");  
    
    let project  = this.projects.filter( proj => proj.projectId + "" === projectSelected.projectId + "")[0];      
    

    if(project) {
        this.projects = this.projects.filter( proj => proj.projectId + "" != projectSelected.projectId );      
        this.chosenProject.push(project);
        this._projectService.choosenProjectlist(this.chosenProject);
        this.getReports();
    }
    
    console.log(project);    
  }
  

  getReports(){

    console.log(this.chosenProject);
    console.log("Enter into getReports");
   // this.toastr.info("Refreshing Data...")
  

    var projects: string[] = [];
    
    this.chosenProject.forEach(cp => projects.push(cp.projectId+"")); 
    
    if(projects.length <= 0) {
        //this.toastr.info('Please choose projects for querying','Please Choose Projects');
        this.rowData=[];
        return;
    }

    this.hideprogress = false;
    console.log("projet name ");
    console.log(projects);
    

    
    this._reportservice.getReportForProject(projects)
        .subscribe( data => {
            var serviceRowData: Report[]=data;
             this.rowData = this._reportservice.convertReport(serviceRowData); 
             if(this.rowData.length>0){
                 let index=0;
                 for(let i=0;i<serviceRowData.length;i++){
                     if(serviceRowData[i].reportAdjustmentEntity.length===12){
                        index=i;
                        console.log("index of the record");
                        console.log(index);
                        break;
                     }
                 }
                
                 
                this.createDynamicColumn(data[index])
             }
             this.hideprogress = true;}
        ,error=>{
            this.toastr.error(error, 'Error!');
        }); 

}

getALLReports(){
    this.hideprogress = false;    
    this._reportservice.getAllReports()
        .subscribe( data => {
            var serviceRowData: Report[]=data;
             this.rowData = this._reportservice.convertReport(serviceRowData); 
             if(this.rowData.length>0){
                 let index=0;
                 for(let i=0;i<serviceRowData.length;i++){
                     if(serviceRowData[i].reportAdjustmentEntity.length===12){
                        index=i;
                        console.log("index of the record");
                        console.log(index);
                        break;
                     }
                 }
                
                 
                this.createDynamicColumn(data[index])
             }
             this.hideprogress = true;
             this.onBtExport();
            }
        ,error=>{
            this.toastr.error(error, 'Error!');
        }); 
}

listAllProject(){
    this.showALLChip = true;
    this.chosenProject = new Array<Project>();    
    this.hideprogress = false;
    this._reportservice.getAllReports()
        .subscribe( data => {
            var serviceRowData: Report[]=data;
             this.rowData = this._reportservice.convertReport(serviceRowData); 
             if(this.rowData.length>0){
                 let index=0;
                 for(let i=0;i<serviceRowData.length;i++){
                     if(serviceRowData[i].reportAdjustmentEntity.length===12){
                        index=i;
                        console.log("index of the record");
                        console.log(index);
                        break;
                     }
                 }
                
                 
                this.createDynamicColumn(data[index])
             }
             this.hideprogress = true;
            }
        ,error=>{
            this.toastr.error(error, 'Error!');
        }); 
}

removeAllProjectSelection(){
    this.showALLChip = false;
    console.log("remove all .. all project")
    this.getReports();
}

focusOnProjectAutoComplete(){
    this.filteredProjectsObs = new Observable<Project[]>(
        observer => {
            observer.next(this.projects);
        }

    );
}
  
}

@Component({
    selector: 'dialog-overview-example-dialog',
    templateUrl: 'dialog-overview-example-dialog.html',
  })
  export class DialogOverviewExampleDialog {
  
   // sampleData:ReportAdjusment[];
    locationType:string[];
    cityList:string[];
    billabilityList:string[];
    projects: Project[];
    selectedProjectID:number;
    projectName:string;
    selectedlocation:string;
    selectedBillabilityType:string;
    selectedCity:string;
    
    constructor(
      public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
      @Inject(MAT_DIALOG_DATA) public data: any,public _reportService:ReportService, _projectService: ProjectService) {
        //   if(this._reportService.sendingSampleData()!=undefined){
        //     this.sampleData=this._reportService.sendingSampleData().reportAdjustmentEntity;
        //   }
          
        console.log("constructor of dialog ");
       // console.log(this.sampleData);
       //var utils =new Utils();
        this.locationType=Utils.locationType;
        this.cityList=Utils.cityList;
        this.billabilityList=Utils.billability;
        console.log("location");
        console.log(this.locationType);
        
        
        // _projectService.getAllProjects().subscribe(projects => {
        //     this.projects = projects;
        //     console.log("projects ");
        //     console.log(projects);
        // });
        this.projects=_projectService.getChoosenProjectlist();
       }
       submitForm(data){
        console.log("from dialog ");
           data.from="save";
           data.locationType=this.selectedlocation;
           data.projectName=this.projectName;
           data.projectId=this.selectedProjectID;
           data.city=this.selectedCity;
           data.billability=this.selectedBillabilityType
           console.log(data);
           this.dialogRef.close(data);
       }
       onChange(projectID:number,projectName:string) {
           console.log(projectID);
        this.projectName=projectName;
        this.selectedProjectID=projectID;
      }
      onChangeLocation(locationType:string){
          this.selectedlocation=locationType;
      }
      onChangecity(city:string){
        this.selectedCity=city;
      }
      onChangebillability(billability:string){
        this.selectedBillabilityType=billability;
      }
    onNoClick(): void {
      this.dialogRef.close();
    }
    // createRange(){
    //     console.log(this._reportService.sendingSampleData());
    //     return this._reportService.sendingSampleData();
    //   }
  }
