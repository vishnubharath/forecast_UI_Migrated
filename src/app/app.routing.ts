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
   { path: 'login', component: LoginComponent },
   { path: 'home', component: HomeComponent },
   { path: 'leaveModule', component: LeaveComponent },
   { path: 'reportModule', component: ReportComponent },
   { path: 'uploadModule', component: UploadComponent },
   { path: 'pipeLineModule', component: PipeLineComponent },
   { path: 'projectPipeLineComponent', component: ProjectPipeLineComponent },
   { path: 'projectPipeLineComponent/:id', component: ProjectPipeLineComponent },
   { path: 'pipeLineModule/:id', component: PipeLineComponent },
   { path: '', redirectTo: '/login',pathMatch:'full'},
   { path: '**', component: PageNotFoundComponent }
 ];

export const appRoutingProviders: any[] = [

];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
