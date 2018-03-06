import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import { HttpModule, JsonpModule } from '@angular/http';
// ag-grid
import {AgGridModule} from "ag-grid-angular/main";
// application
import {AppComponent} from "./app.component";
// rich grid
import {RichGridComponent} from "./rich-grid-example/rich-grid.component";
import {DateComponent} from "./date-component/date.component";
import {HeaderComponent} from "./header-component/header.component";
import {HeaderGroupComponent} from "./header-group-component/header-group.component";
import { ReportService } from "./Report/report.service";
import { ProjectService } from "./Report/project.service";


import { MatButtonModule, MatCheckboxModule, MatInputModule } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { UpdateReportDialog } from './Dialog/update-report-dialog.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        BrowserAnimationsModule,
        MatButtonModule, MatCheckboxModule, MatTableModule, MatPaginatorModule, MatSortModule,
        MatDialogModule, MatGridListModule, MatInputModule,MatIconModule,
        MatFormFieldModule,
    JsonpModule,
        AgGridModule.withComponents(
            [
                DateComponent,
                HeaderComponent,
                HeaderGroupComponent
            ]
        )
    ],
    declarations: [
        AppComponent,
        RichGridComponent,
        DateComponent,
        HeaderComponent,
        HeaderGroupComponent,UpdateReportDialog
    ],
    providers: [ReportService, ProjectService],
    bootstrap: [AppComponent],
    entryComponents: [
        UpdateReportDialog
      ]
})
export class AppModule {
}
