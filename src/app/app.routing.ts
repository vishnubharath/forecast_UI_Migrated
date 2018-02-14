import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeaveComponent } from "./modules/leave/leave.component";
import { ReportComponent } from "./modules/report/report.component";
import { UploadComponent} from './modules/upload/app.upload';
import { PipeLineComponent} from './modules/pipeline/pipeline.component';
import { ProjectPipeLineComponent} from './modules/pipeline/project.pipeline.component';
import { HomeComponent } from './ts/home.component';
import { LoginComponent } from './modules/login/login.component';

import { PageNotFoundComponent }    from './not-found.component';

const appRoutes: Routes = [
    { path: 'leaveModule', component: LeaveComponent },
    { path: '**', component: PageNotFoundComponent }
 ];

export const appRoutingProviders: any[] = [

];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
