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
    public  duplicaterowData: ReportType[]=[];
    //public parentRowData: ReportType[]=[];
    public  errorData: ReportType[]=[];
    public  parentRowData = new Map();
    private rowClassRules;
    
    //Controls
    projectCtrl: FormControl;
   
    public addRowData: ReportType;

    // Chips Config
    selectable: boolean = true;
    removable: boolean = true;
    addOnBlur: boolean = true;
    // Enter, comma
    separatorKeysCodes = [ENTER, COMMA];

  
    
    constructor(_reportservice: ReportService, _projectService: ProjectService,public dialog: MatDialog,public toastr: ToastsManager, vcr: ViewContainerRef ) {
        // we pass an empty gridOptions in, so we can grab the api out
        this.toastr.setRootViewContainerRef(vcr);
        this._reportservice = _reportservice;
        this._projectService = _projectService;
        this.gridOptions = <GridOptions>{};
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
                project.projectName.toLowerCase().indexOf((value + "").toLowerCase()) === 0);
            
            this.filteredProjectsObs = new Observable<Project[]>(
                observer => {
                    observer.next(this.filteredProjects);
                }

            );
        });


        this.rowClassRules = {
            "duplicated-row": function(params){
                return params.data.reportId===undefined;
            }
            // "duplicated_row_error": function(params){
            //     if(params.data.reportId===undefined){
            //             return true;
            //     }
            //     return false
            // }
            

          };
    }

   
    private createRowData() {
        console.log("enter into create Row data");
        this.hideprogress = false;
        this.addNewRow=true;
        this._reportservice.getCurrentReport().subscribe(rowdata => {
            this.serviceRowData = rowdata;
            this.createDynamicColumn(this.serviceRowData[0])
            this.rowData = this._reportservice.convertReport(this.serviceRowData);
            console.log(rowdata);
            this.hideprogress = true;
        }, err => {
            this.hideprogress = true;
            console.log(err);
        });

        this._projectService.getAllProjects().subscribe(projects => {
            this.projects = projects;
            console.log("projects ");
            console.log(projects);
            
        });

        console.log("inside the create row data" + this.rowData)
    }
    private createDynamicColumn(reportdata:Report){
        console.log("Length of the record"+reportdata.reportAdjustmentEntity.length)
               
                for(let i=0;i<reportdata.reportAdjustmentEntity.length;i++){
    
              var params=  {
                        headerName: reportdata.reportAdjustmentEntity[i].forecastedMonth,
        
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
                        width: 150, pinned: false,editable:true
                    },
                    {
                        headerName: "City", field: "city", filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false
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
                        headerName: "Allocation Enddate", field: "allocEnddate", filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
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
            },

            // {
            //     headerName: 'Feb',

            //     children: [
            //         {
            //             headerName: "Hours", field: "hours_1", filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
            //             width: 150, pinned: false, editable: true
            //         },
            //         {
            //             headerName: "Adjustment", field: "adjustment_1", filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
            //             width: 150, pinned: false, editable: true
            //         },
            //         {
            //             headerName: "Rate", field: "rate_1", filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
            //             width: 150, pinned: false, editable: true
            //         },
            //         {
            //             headerName: "Revenue", valueFormatter: function RevenueFormater(params) {
            //                 console.log(params.data.revenue_1);

            //                 return "CAD" + " " + params.data.revenue_1.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            //             }, filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
            //             width: 150, pinned: false, valueGetter: function aPlusBValueGetter(params) {
            //                 params.data.revenue_1 = (params.data.hours_1 - params.data.adjustment_1) * params.data.rate_1
            //                 return params.data.revenue_1;
            //             }
            //         },
            //     ]
            // },

            // {
            //     headerName: 'March',

            //     children: [
            //         {
            //             headerName: "Hours", field: "hours_2", filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
            //             width: 150, pinned: false, editable: true
            //         },
            //         {
            //             headerName: "Adjustment", field: "adjustment_2", filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
            //             width: 150, pinned: false, editable: true
            //         },
            //         {
            //             headerName: "Rate", field: "rate_2", filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
            //             width: 150, pinned: false, editable: true
            //         },
            //         {
            //             headerName: "Revenue", valueGetter: function aPlusBValueGetter(params) {
            //                 params.data.revenue_2 = (params.data.hours_2 - params.data.adjustment_2) * params.data.rate_2
            //                 return params.data.revenue_2;
            //             }, filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
            //             width: 150, pinned: false, valueFormatter: function RevenueFormater(params) {
            //                 return "CAD" + " " + params.data.revenue_2.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            //             }
            //         },
            //     ]
            // },

            // {
            //     headerName: 'April',

            //     children: [
            //         {
            //             headerName: "Hours", field: "hours_3", filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
            //             width: 150, pinned: false, editable: true
            //         },
            //         {
            //             headerName: "Adjustment", field: "adjustment_3", filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
            //             width: 150, pinned: false, editable: true
            //         },
            //         {
            //             headerName: "Rate", field: "rate_3", filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
            //             width: 150, pinned: false, editable: true
            //         },
            //         {
            //             headerName: "Revenue", valueGetter: function aPlusBValueGetter(params) {
            //                 params.data.revenue_3 = (params.data.hours_3 - params.data.adjustment_3) * params.data.rate_3
            //                 return params.data.revenue_3;
            //             }, filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
            //             width: 150, pinned: false, valueFormatter: function RevenueFormater(params) {
            //                 return "CAD" + " " + params.data.revenue_3.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            //             }
            //         },
            //     ]
            // },

            // {
            //     headerName: 'May',

            //     children: [
            //         {
            //             headerName: "Hours", field: "hours_4", filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
            //             width: 150, pinned: false, editable: true
            //         },
            //         {
            //             headerName: "Adjustment", field: "adjustment_4", filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
            //             width: 150, pinned: false, editable: true
            //         },
            //         {
            //             headerName: "Rate", field: "rate_4", filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
            //             width: 150, pinned: false, editable: true
            //         },
            //         {
            //             headerName: "Revenue", valueGetter: function aPlusBValueGetter(params) {
            //                 params.data.revenue_4 = (params.data.hours_4 - params.data.adjustment_4) * params.data.rate_4
            //                 return params.data.revenue_4;
            //             }, filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
            //             width: 150, pinned: false, valueFormatter: function RevenueFormater(params) {
            //                 return "CAD" + " " + params.data.revenue_4.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            //             }
            //         },
            //     ]
            // },

            // {
            //     headerName: 'June',

            //     children: [
            //         {
            //             headerName: "Hours", field: "hours_5", filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
            //             width: 150, pinned: false, editable: true
            //         },
            //         {
            //             headerName: "Adjustment", field: "adjustment_5", filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
            //             width: 150, pinned: false, editable: true
            //         },
            //         {
            //             headerName: "Rate", field: "rate_5", filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
            //             width: 150, pinned: false, editable: true
            //         },
            //         {
            //             headerName: "Revenue", valueGetter: function aPlusBValueGetter(params) {
            //                 params.data.revenue_5 = (params.data.hours_5 - params.data.adjustment_5) * params.data.rate_5
            //                 return params.data.revenue_5;
            //             }, filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
            //             width: 150, pinned: false, valueFormatter: function RevenueFormater(params) {
            //                 return "CAD" + " " + params.data.revenue_5.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            //             }
            //         },
            //     ]
            // },


            // {
            //     headerName: 'July',

            //     children: [
            //         {
            //             headerName: "Hours", field: "hours_6", filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
            //             width: 150, pinned: false, editable: true
            //         },
            //         {
            //             headerName: "Adjustment", field: "adjustment_6", filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
            //             width: 150, pinned: false, editable: true
            //         },
            //         {
            //             headerName: "Rate", field: "rate_6", filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
            //             width: 150, pinned: false, editable: true
            //         },
            //         {
            //             headerName: "Revenue", valueGetter: function aPlusBValueGetter(params) {
            //                 params.data.revenue_6 = (params.data.hours_6 - params.data.adjustment_6) * params.data.rate_6
            //                 return params.data.revenue_6;
            //             }, filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
            //             width: 150, pinned: false, valueFormatter: function RevenueFormater(params) {
            //                 return "CAD" + " " + params.data.revenue_6.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            //             }
            //         },
            //     ]
            // },

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

        if($event.node.data.reportId===undefined){
            // if (this.duplicaterowData.filter(data => $event.node.data[idFiled] === data).length > 0) {
                 console.log("Duplicate record changes..");
                 this.duplicaterowData.forEach(data => {
                     if (data.associateId === $event.node.data["associateId"] && data.projectId === $event.node.data["projectId"]) {
                         // data.adjusment = $event.node.data[adjustment];
                         // data.hours = $event.node.data[hoursFiled];
                         // data.rate = $event.node.data[rateFiled];
                         // data.projectId=$event.node.data["projectId"];
                         // data.associateId=$event.node.data["associateId"];
                         data[$event.colDef.field]=$event.newValue;
                     }
                 });
          //   }
         }else if (this.updatedRowData.filter(data => $event.node.data[idFiled] === data[idFiled]).length > 0) {
            console.log("containts..");
            this.updatedRowData.forEach(data => {
                if (data[idFiled] === $event.node.data[idFiled]) {
                    // data.adjusment = $event.node.data[adjustment];
                    // data.hours = $event.node.data[hoursFiled];
                    // data.rate = $event.node.data[rateFiled];
                    // data.projectId=$event.node.data["projectId"];
                    // data.associateId=$event.node.data["associateId"];
                    // data.locationType=$event.node.data["location"];
                    data[$event.colDef.field]=$event.newValue;
                }
            });
        } else {
            console.log("push..");
            var newValueChanges: Adjustment = new Adjustment();
            // newValueChanges.id = $event.node.data[idFiled];
            // newValueChanges.adjusment = $event.node.data[adjustment];
            // newValueChanges.hours = $event.node.data[hoursFiled];
            // newValueChanges.rate = $event.node.data[rateFiled];
            // newValueChanges.rowIndex=$event.rowIndex;
            // newValueChanges.projectId=$event.node.data["projectId"];
            // newValueChanges.associateId=$event.node.data["associateId"];
            // newValueChanges.locationType=$event.node.data["location"];
           // var rowData_record: ReportType[]   =this._reportservice.createDuplicateRow($event.node.data);
           console.log($event.node.data);
           var tmp =$event.node.data;
            tmp.reportDataType="Update";
            this.updatedRowData.push(tmp);
            console.log(this.updatedRowData);
            this.addNewRow=false;
            //this.updatedValues.push(newValueChanges);
        }

        console.log(this.updatedValues);
 // this.updatedValues.forEach(data => {
        //     console.log("===============");
            
        //     console.log(data.rowIndex);
            
        //     this.gridOptions.getRowStyle = function(params) {
        //         console.log(params.node.rowIndex);
        //         console.log(data.rowIndex);
        //         console.log("====================");
                
        //             if (data.rowIndex === params.node.rowIndex) {
        //                 return { background: 'green' }
        //             }
        //     }});
        console.log('onCellValueChanged: ' + $event.oldValue + ' to ' + $event.newValue + ' ' + $event.rowIndex + ' ' + $event.node.data.projectId + " " + $event.node.data.projectName);
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
            if( this.errorData.length===0){
                this.updatedRowData.forEach(rowData=>{
                    this.duplicaterowData.push(rowData);
                });
                //Final Data send to server 
                console.log("Final data");
                console.log(this.duplicaterowData);
                
                
                this._reportservice.duplicateReportSave(this.duplicaterowData).then(data => {
                    this.hideprogress = true;
                    this.duplicaterowData=null;
                    this.errorData=null;
                    this.updatedRowData=null;
                    this.addNewRow=true;
                }).catch(err => { console.log(err); this.hideprogress = true; }
                );
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
                
            }
            //color part
            console.log(this.duplicaterowData);
       // }
        // if(this.updatedValues.length>0){
        //     this._reportservice.reportsave(this.updatedValues).then(data => {
        //         this.hideprogress = true;
        //         //alert("Updated");
        //     }).catch(err => { console.log(err); this.hideprogress = true; }
        //     );
        //     console.log(this.updatedValues);
        // }
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
      showSuccess() {
        this.toastr.success('You are awesome!', 'Success!');
      }

   


    onDuplicateRow(){
        if(this.selectedRow){
            console.log(this.gridOptions.api.getSelectedRows());
            
          var rowData_record: ReportType[]   = this._reportservice.createDuplicateRow(this.gridOptions.api.getSelectedRows());
          rowData_record[0].reportDataType="duplicate";
          console.log("duplicated data check");
          console.log(rowData_record);
          this.duplicaterowData.push(rowData_record[0]);
          this.parentRowData.set(rowData_record[0].associateId+"-"+rowData_record[0].projectId+"-"+rowData_record[0].location,rowData_record[0]);
          this.gridOptions.api.updateRowData({ add: rowData_record,addIndex: this.selectedRowIndex+1 });
          rowData_record=null;
          // this.gridOptions.api.startEditingCell({
          //     rowIndex: 0,
          //     colKey: "associateId"
          //   });
          //   this.gridOptions.api.setFocusedCell(0, "associateId")
          this.toastr.success('Data Duplicated', 'Success!');
        }
      console.log("data from duplicate "+this.duplicaterowData);
      console.log(this.duplicaterowData);
      
      
    }

    onDeleteRow(){
        if(this.selectedRow){
            var rowData_record: ReportType[]   = this._reportservice.createDuplicateRow(this.gridOptions.api.getSelectedRows());
            if(rowData_record[0].reportId!=undefined){
                this._reportservice.deleteReport(rowData_record).subscribe(result => {
                    console.log(result);
                    this.toastr.success('Data Deleted', 'Success!');
                },error=>{
                    this.toastr.error(error, 'Error!');
                });
            }else{
                var selectedData = this.gridOptions.api.getSelectedRows();
                this.gridOptions.api.updateRowData({ remove: selectedData });
                var index=this.duplicaterowData.indexOf(selectedData[0]);
                console.log(this.duplicaterowData);
                this.duplicaterowData.splice(index,1);
                console.log("from delete else part");
                console.log(this.duplicaterowData);
                
                // var associateId=selectedData[0].associateId;
                // var projectId=selectedData[0].associateId;
                // var location=selectedData[0].location;
                // let index=0;
                // this.duplicaterowData.forEach(data=>{
                //     index++;
                //     if(this.parentRowData.has(data.associateId===associateId && data.projectId===projectId && data.location===location)){
                //         data.
                //     }
                // });
            }
            
        } 
    }
    

   

  

  openDialog(): void {
    let dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '75%',
      data: { data: this.addRowData}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      //this.addRowData = result;
      //console.log(this.addRowData); 
    //   var report:ReportType[]=[];
    //   console.log(this._reportservice.convertData(result));
      
    //   report.push(this._reportservice.convertData(result))
    //   console.log(report);
        console.log(result.from);
    
      if(result.from==="save"){
        this._reportservice.duplicateReportSave(this._reportservice.convertData(result)).then(resp=>{
            this.toastr.success('Data Added', 'Success!'); 
           // var record:ReportType=this._reportservice.convertData(result)[0];
           // this.gridOptions.api.updateRowData({ add: this._reportservice.convertData(result) });
        }).catch(error=>{
                this.toastr.error(error, 'Error!');
        });
      }else{
          console.log("inside cancel");
         // this.toastr.error('This is not good!', 'Oops!');
          
      }
      
    });
  }

  add(event: MatChipInputEvent): void {
    let input = event.input;
    let value = event.value;
  
    // Add our fruit
    if ((value || '').trim()) {
      
      
      
      let project  = this.projects.filter( proj => proj.projectId + "" === value )[0];

      if(project) {
        this.projects = this.projects.filter( proj => proj.projectId + "" != value );
        this.chosenProject.push(project);
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
      this.projects.push(project)
    }
  }

  autoComplete(projectSelected:any){
    console.log("->");    
    this.projectCtrl.setValue("");  
    
    let project  = this.projects.filter( proj => proj.projectId + "" === projectSelected.projectId + "")[0];      
    

    if(project) {
        this.projects = this.projects.filter( proj => proj.projectId + "" != projectSelected.projectId );      
        this.chosenProject.push(project);
    }
    
    console.log(project);    
  }

  getReports(){

    console.log(this.chosenProject);
    
    var projects: string[] = [];
    
    this.chosenProject.forEach(cp => projects.push(cp.projectId+""));    

    this.hideprogress = false;
    this._reportservice.getReportForProject(projects)
        .subscribe( data => {
             this.rowData = this._reportservice.convertReport(data); 
             this.hideprogress = true;}
        ,error=>{
            this.toastr.error(error, 'Error!');
        }); 

}
  
  
}




@Component({
    selector: 'dialog-overview-example-dialog',
    templateUrl: 'dialog-overview-example-dialog.html',
  })
  export class DialogOverviewExampleDialog {
  
    sampleData:ReportAdjusment[];
    constructor(
      public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
      @Inject(MAT_DIALOG_DATA) public data: any,public _reportService:ReportService) {
        this.sampleData=this._reportService.sendingSampleData().reportAdjustmentEntity;
        console.log("constructor of dialog ");
        console.log(this.sampleData);
        
       }
       submitForm(data){
        console.log("from dialog ");
       
           data.from="save";
           this.dialogRef.close(data);
       
           
       }
    onNoClick(): void {
      this.dialogRef.close();
    }
    // createRange(){
    //     console.log(this._reportService.sendingSampleData());
    //     return this._reportService.sendingSampleData();
    //   }
  }
