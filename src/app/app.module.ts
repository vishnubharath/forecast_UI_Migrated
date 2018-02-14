import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';

//import { AppComponent }  from './app.component';
import {PageNotFoundComponent} from './not-found.component';

import { AppComponent }  from './ts/app.component';
import { UploadComponent} from './modules/upload/app.upload';
import {HolidayService} from "./modules/holiday/Holiday.service";
import {HolidayComponent} from "./modules/holiday/app.holiday.list";
import { LeaveComponent } from "./modules/leave/leave.component";
import { ReportComponent } from "./modules/report/report.component";
import { ReportService} from "./modules/report/report.service";
import {StaffPipelineService} from './modules/pipeline/service.staffpipeline';
import {ProjectPipelineService} from './modules/pipeline/service.projectpipeline';
import { ProjectPipeLineComponent } from './modules/pipeline/project.pipeline.component';
import { PipeLineComponent } from './modules/pipeline/pipeline.component';

import {MenuItem} from 'primeng/components/common/api';
import { TabViewModule } from 'primeng/components/tabview/tabview';
import {FileUploadModule,CalendarModule,DataTableModule,ButtonModule,PanelModule,InputTextModule,DialogModule,DropdownModule,SelectItem,AccordionModule,SharedModule,TieredMenuModule} from 'primeng/primeng';

import { UploadService } from "./modules/upload/Upload.service";
import { ReportListComponent } from "./modules/report/report.list";
import {ForecastMonthsService} from './ts/ForecastMonths.service';
import { LoginComponent } from './modules/login/login.component';
import { routing,appRoutingProviders }  from './app.routing';
import { HomeComponent } from './ts/home.component';
import { ModalModule } from 'ng2-modal';

@NgModule({
  imports:      [   
    BrowserModule,
		FormsModule,
		HttpModule,
		JsonpModule,
		routing,
		TabViewModule,
		ModalModule,
		FileUploadModule,PanelModule,CalendarModule,DataTableModule,ButtonModule,InputTextModule,AccordionModule,SharedModule,DialogModule,DropdownModule,TieredMenuModule
   ],
  declarations: [ 
    AppComponent, HolidayComponent, LoginComponent,LeaveComponent, ReportListComponent, ReportComponent,
      UploadComponent, PipeLineComponent,HomeComponent,ProjectPipeLineComponent,
      PageNotFoundComponent  
  ],
  bootstrap:    [ AppComponent ],
  providers:[
		HolidayService, appRoutingProviders, ReportService,UploadService, ForecastMonthsService,StaffPipelineService,ProjectPipelineService
	]
})
export class AppModule { }
