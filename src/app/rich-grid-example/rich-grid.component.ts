import {Component, ViewEncapsulation} from "@angular/core";
import {GridOptions} from "ag-grid/main";

import ProficiencyFilter from '../filters/proficiencyFilter';



// only import this if you are using the ag-Grid-Enterprise
import 'ag-grid-enterprise/main';

import {HeaderGroupComponent} from "../header-group-component/header-group.component";
import {DateComponent} from "../date-component/date.component";
import {HeaderComponent} from "../header-component/header.component";
import { ReportService } from "../Report/report.service";
import { Report } from "../Report/report";
import { ReportType } from "../Report/ReportType";
import { Adjustment } from "../Report/Adjustments";

@Component({
    selector: 'rich-grid',
    templateUrl: 'rich-grid.component.html',
    styleUrls: ['rich-grid.css', 'proficiency-renderer.css'],
    encapsulation: ViewEncapsulation.None
})
export class RichGridComponent {

    private gridOptions:GridOptions;
    public showGrid:boolean;
    public serviceRowData:Report[];
    public rowData:ReportType[];
    private columnDefs:any[];
    public rowCount:string;
    public dateComponentFramework:DateComponent;
    public HeaderGroupComponent = HeaderGroupComponent;
    public _reportservice:ReportService;
   
    private updatedValues : Adjustment[] = [];

    constructor(_reportservice:ReportService) {
        // we pass an empty gridOptions in, so we can grab the api out
        this._reportservice=_reportservice;
        this.gridOptions = <GridOptions>{};
        this.createRowData();
        this.createColumnDefs();
        this.showGrid = true;
        this.gridOptions.dateComponentFramework = DateComponent;
        this.gridOptions.defaultColDef = {
            editable: false,
            width: 100,
            headerComponentFramework : <{new():HeaderComponent}>HeaderComponent,
            headerComponentParams : {
                menuIcon: 'fa-bars'
            }
        }
       
    }

    private createRowData() {
        console.log("enter into create Row data");
        this._reportservice.getCurrentReport().subscribe(rowdata =>{
            this.serviceRowData=rowdata; 
            this.rowData = this._reportservice.convertReport(this.serviceRowData);
            console.log(rowdata);
        },err => {
            console.log(err);
        });
        console.log("inside the create row data"+this.rowData)
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
                        headerName: "Associate ID", field: "associateId",filter: "agTextColumnFilter",sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false
                    },
                    {
                        headerName: "Associate Name", field: "associateName",filter: "agTextColumnFilter",sortingOrder: ["asc", "desc"],
                        width: 150, pinned: true
                    },
                    {
                        headerName: "HR Grade", field: "associateGrade",filter: "agTextColumnFilter",sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false
                    },
                    {
                        headerName: "Location", field: "location",filter: "agTextColumnFilter",sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false
                    },
                    {
                        headerName: "City", field: "city",filter: "agTextColumnFilter",sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false
                    },
                    {
                        headerName: "Billability", field: "billability",filter: "agTextColumnFilter",sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false
                    },
                    
                ]
            },
            {
                headerName: 'Project ',
                
                children: [
                    {
                        headerName: "Customer ID", field: "customerId",filter: "agTextColumnFilter",sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false
                    },
                    {
                        headerName: "Customer Name", field: "customerName",filter: "agTextColumnFilter",sortingOrder: ["asc", "desc"],
                        width: 150 
                    },
                    {
                        headerName: "Project ID", field: "projectId",filter: "agTextColumnFilter",sortingOrder: ["asc", "desc"],
                        width: 150,pinner: false
                    },
                    {
                        headerName: "Project Name", field: "projectName",filter: "agTextColumnFilter",sortingOrder: ["asc", "desc"],
                        width: 150, pinned: true
                    },
                    {
                        headerName: "Portfolio", field: "portfolio",filter: "agTextColumnFilter",sortingOrder: ["asc", "desc"],
                        width: 150
                    },
                    {
                        headerName: "POCs", field: "poc",filter: "agTextColumnFilter",sortingOrder: ["asc", "desc"],
                        width: 150
                    },
                    {
                        headerName: "Project Billability", field: "projectBillability",filter: "agTextColumnFilter",sortingOrder: ["asc", "desc"],
                        width: 150
                    },
                ]
            }, 
            
            {
                headerName: 'Feb',
                
                children: [
                    {
                        headerName: "Hours", field: "hours1",filter: "agTextColumnFilter",sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false
                    },
                    {
                        headerName: "Adjustment", field: "adjustment1",filter: "agTextColumnFilter",sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false, editable: true
                    },
                    {
                        headerName: "Rate", field: "rate1",filter: "agTextColumnFilter",sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false
                    },
                    {
                        headerName: "Revenue", field: "revenue1",filter: "agTextColumnFilter",sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false
                    },
                ]
            },
            
            {
                headerName: 'March',
                
                children: [
                    {
                        headerName: "Hours", field: "hours2",filter: "agTextColumnFilter",sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false
                    },
                    {
                        headerName: "Adjustment", field: "adjustment2",filter: "agTextColumnFilter",sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false, editable: true
                    },
                    {
                        headerName: "Rate", field: "rate2",filter: "agTextColumnFilter",sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false
                    },
                    {
                        headerName: "Revenue", field: "revenue2",filter: "agTextColumnFilter",sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false
                    },
                ]
            },

            {
                headerName: 'April',
                
                children: [
                    {
                        headerName: "Hours", field: "hours3",filter: "agTextColumnFilter",sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false
                    },
                    {
                        headerName: "Adjustment", field: "adjustment3",filter: "agTextColumnFilter",sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false, editable: true
                    },
                    {
                        headerName: "Rate", field: "rate3",filter: "agTextColumnFilter",sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false
                    },
                    {
                        headerName: "Revenue", field: "revenue3",filter: "agTextColumnFilter",sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false
                    },
                ]
            },

            {
                headerName: 'May',
                
                children: [
                    {
                        headerName: "Hours", field: "hours4",filter: "agTextColumnFilter",sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false
                    },
                    {
                        headerName: "Adjustment", field: "adjustment4",filter: "agTextColumnFilter",sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false, editable: true
                    },
                    {
                        headerName: "Rate", field: "rate4",filter: "agTextColumnFilter",sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false
                    },
                    {
                        headerName: "Revenue", field: "revenue4",filter: "agTextColumnFilter",sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false
                    },
                ]
            },

            {
                headerName: 'June',
                
                children: [
                    {
                        headerName: "Hours", field: "hours5",filter: "agTextColumnFilter",sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false
                    },
                    {
                        headerName: "Adjustment", field: "adjustment5",filter: "agTextColumnFilter",sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false, editable: true
                    },
                    {
                        headerName: "Rate", field: "rate5",filter: "agTextColumnFilter",sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false
                    },
                    {
                        headerName: "Revenue", field: "revenue5",filter: "agTextColumnFilter",sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false
                    },
                ]
            },
            

            {
                headerName: 'July',
                
                children: [
                    {
                        headerName: "Hours", field: "hours6",filter: "agTextColumnFilter",sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false
                    },
                    {
                        headerName: "Adjustment", field: "adjustment6",filter: "agTextColumnFilter",sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false, editable: true
                    },
                    {
                        headerName: "Rate", field: "rate6",filter: "agTextColumnFilter",sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false
                    },
                    {
                        headerName: "Revenue", field: "revenue6",filter: "agTextColumnFilter",sortingOrder: ["asc", "desc"],
                        width: 150, pinned: false
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

        console.log("data..");        
        console.log("field name : " + $event.colDef.field);       
        console.log("project id :" + $event.node.data.reportId); 
        console.log("adj val : " + $event.node.data[$event.colDef.field]);         
        console.log("adj id : " + $event.node.data[$event.colDef.field + "_id"]);   
        
        console.log(this.updatedValues);        
        
        if(this.updatedValues.filter(data => $event.node.data[$event.colDef.field + "_id"] === data.id ).length > 0)
        {
            console.log("containts..");
            this.updatedValues.forEach(data => {
                if(data.id === $event.node.data[$event.colDef.field + "_id"]){
                    data.adjusment = $event.node.data[$event.colDef.field];
                }                   
            });                        
        }else{
            console.log("push..");   
            var newValueChanges: Adjustment= new Adjustment();
            newValueChanges.id = $event.node.data[$event.colDef.field + "_id"];
            newValueChanges.adjusment = $event.node.data[$event.colDef.field];
            this.updatedValues.push(newValueChanges);
        }

        console.log(this.updatedValues);

        console.log('onCellValueChanged: ' + $event.oldValue + ' to ' + $event.newValue+' '+$event.rowIndex+' '+$event.node.data.projectId +" "+$event.node.data.projectName);
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
    
    public saveUpdated(){
        this._reportservice.reportsave(this.updatedValues).catch(err=> console.log(err));
        console.log(this.updatedValues);
    }

    
      
    
}

