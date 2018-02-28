import { Component, ViewEncapsulation } from "@angular/core";
import { GridOptions } from "ag-grid/main";

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
    public chosenProject:string[];
    public rowData: ReportType[];
    private columnDefs: any[];
    public rowCount: string;
    public dateComponentFramework: DateComponent;
    public HeaderGroupComponent = HeaderGroupComponent;
    public _reportservice: ReportService;
    public _projectService: ProjectService;
    public hideprogress: boolean = true;
    private updatedValues: Adjustment[] = [];

    constructor(_reportservice: ReportService, _projectService: ProjectService ) {
        // we pass an empty gridOptions in, so we can grab the api out
        this._reportservice = _reportservice;
        this._projectService = _projectService;
        this.gridOptions = <GridOptions>{};
        this.createRowData();
        this.createColumnDefs();
        this.showGrid = true;
        this.gridOptions.dateComponentFramework = DateComponent;
        this.gridOptions.defaultColDef = {
            editable: false,
            width: 100,
            headerComponentFramework: <{ new(): HeaderComponent }>HeaderComponent,
            headerComponentParams: {
                menuIcon: 'fa-bars'
            }
        }

    }

    private createRowData() {
        console.log("enter into create Row data");
        this.hideprogress = false;
        this._reportservice.getCurrentReport().subscribe(rowdata => {
            this.serviceRowData = rowdata;
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

    private createColumnDefs() {
        this.columnDefs = [
            // {
            //     headerName: '#', width: 30, checkboxSelection: true, suppressSorting: true,
            //     suppressMenu: true, pinned: true
            // },
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
                        width: 150, pinned: false
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

            {
                headerName: 'Feb',

                children: [
                    {
                        headerName: "Hours", field: "hours_1", filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false, editable: true
                    },
                    {
                        headerName: "Adjustment", field: "adjustment_1", filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false, editable: true
                    },
                    {
                        headerName: "Rate", field: "rate_1", filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false, editable: true
                    },
                    {
                        headerName: "Revenue", valueFormatter: function RevenueFormater(params) {
                            console.log(params.data.revenue_1);

                            return "CAD" + " " + params.data.revenue_1.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                        }, filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false, valueGetter: function aPlusBValueGetter(params) {
                            params.data.revenue_1 = (params.data.hours_1 - params.data.adjustment_1) * params.data.rate_1
                            return params.data.revenue_1;
                        }
                    },
                ]
            },

            {
                headerName: 'March',

                children: [
                    {
                        headerName: "Hours", field: "hours_2", filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false, editable: true
                    },
                    {
                        headerName: "Adjustment", field: "adjustment_2", filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false, editable: true
                    },
                    {
                        headerName: "Rate", field: "rate_2", filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false, editable: true
                    },
                    {
                        headerName: "Revenue", valueGetter: function aPlusBValueGetter(params) {
                            params.data.revenue_2 = (params.data.hours_2 - params.data.adjustment_2) * params.data.rate_2
                            return params.data.revenue_2;
                        }, filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false, valueFormatter: function RevenueFormater(params) {
                            return "CAD" + " " + params.data.revenue_2.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                        }
                    },
                ]
            },

            {
                headerName: 'April',

                children: [
                    {
                        headerName: "Hours", field: "hours_3", filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false, editable: true
                    },
                    {
                        headerName: "Adjustment", field: "adjustment_3", filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false, editable: true
                    },
                    {
                        headerName: "Rate", field: "rate_3", filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false, editable: true
                    },
                    {
                        headerName: "Revenue", valueGetter: function aPlusBValueGetter(params) {
                            params.data.revenue_3 = (params.data.hours_3 - params.data.adjustment_3) * params.data.rate_3
                            return params.data.revenue_3;
                        }, filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false, valueFormatter: function RevenueFormater(params) {
                            return "CAD" + " " + params.data.revenue_3.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                        }
                    },
                ]
            },

            {
                headerName: 'May',

                children: [
                    {
                        headerName: "Hours", field: "hours_4", filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false, editable: true
                    },
                    {
                        headerName: "Adjustment", field: "adjustment_4", filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false, editable: true
                    },
                    {
                        headerName: "Rate", field: "rate_4", filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false, editable: true
                    },
                    {
                        headerName: "Revenue", valueGetter: function aPlusBValueGetter(params) {
                            params.data.revenue_4 = (params.data.hours_4 - params.data.adjustment_4) * params.data.rate_4
                            return params.data.revenue_4;
                        }, filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false, valueFormatter: function RevenueFormater(params) {
                            return "CAD" + " " + params.data.revenue_4.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                        }
                    },
                ]
            },

            {
                headerName: 'June',

                children: [
                    {
                        headerName: "Hours", field: "hours_5", filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false, editable: true
                    },
                    {
                        headerName: "Adjustment", field: "adjustment_5", filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false, editable: true
                    },
                    {
                        headerName: "Rate", field: "rate_5", filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false, editable: true
                    },
                    {
                        headerName: "Revenue", valueGetter: function aPlusBValueGetter(params) {
                            params.data.revenue_5 = (params.data.hours_5 - params.data.adjustment_5) * params.data.rate_5
                            return params.data.revenue_5;
                        }, filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false, valueFormatter: function RevenueFormater(params) {
                            return "CAD" + " " + params.data.revenue_5.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                        }
                    },
                ]
            },


            {
                headerName: 'July',

                children: [
                    {
                        headerName: "Hours", field: "hours_6", filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false, editable: true
                    },
                    {
                        headerName: "Adjustment", field: "adjustment_6", filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false, editable: true
                    },
                    {
                        headerName: "Rate", field: "rate_6", filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false, editable: true
                    },
                    {
                        headerName: "Revenue", valueGetter: function aPlusBValueGetter(params) {
                            params.data.revenue_6 = (params.data.hours_6 - params.data.adjustment_6) * params.data.rate_6
                            return params.data.revenue_6;
                        }, filter: "agTextColumnFilter", sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false, valueFormatter: function RevenueFormater(params) {
                            return "CAD" + " " + params.data.revenue_6.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                        }
                    },
                ]
            },

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



        console.log(this.updatedValues);

        if (this.updatedValues.filter(data => $event.node.data[idFiled] === data.id).length > 0) {
            console.log("containts..");
            this.updatedValues.forEach(data => {
                if (data.id === $event.node.data[idFiled]) {
                    data.adjusment = $event.node.data[adjustment];
                    data.hours = $event.node.data[hoursFiled];
                    data.rate = $event.node.data[rateFiled];
                }
            });
        } else {
            console.log("push..");
            var newValueChanges: Adjustment = new Adjustment();
            newValueChanges.id = $event.node.data[idFiled];
            newValueChanges.adjusment = $event.node.data[adjustment];
            newValueChanges.hours = $event.node.data[hoursFiled];
            newValueChanges.rate = $event.node.data[rateFiled];
            this.updatedValues.push(newValueChanges);
        }

        console.log(this.updatedValues);

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
        this._reportservice.reportsave(this.updatedValues).then(data => {
            this.hideprogress = true;
            //alert("Updated");
        }).catch(err => { console.log(err); this.hideprogress = true; }
        );
        console.log(this.updatedValues);
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

    getReports(){

        console.log(this.chosenProject);
        
        var projects: Project[] = [];

        this.chosenProject.forEach( id => 
            {
                var project :Project = new Project();
                project.projectId = parseInt(id);
                project.projectName = "test";
                projects.push(project);
            });

        this._reportservice.getReportForProject(this.chosenProject)
            .subscribe( data => { this.rowData = this._reportservice.convertReport(data)}
            );

    }
     
}

