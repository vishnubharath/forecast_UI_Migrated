import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { HttpModule, JsonpModule } from '@angular/http';
// ag-grid
import {AgGridModule} from "ag-grid-angular/main";
// rich grid
import {RichGridComponent, DialogOverviewExampleDialog} from "./rich-grid-example/rich-grid.component";
import {DateComponent} from "./date-component/date.component";
import {HeaderComponent} from "./header-component/header.component";
import {HeaderGroupComponent} from "./header-group-component/header-group.component";
import { ReportService } from "./Report/report.service";
import { ProjectService } from "./Report/project.service";
// application
import {AppComponent} from "./app.component";

//material
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSelectModule} from '@angular/material/select';
import {MatChipsModule} from '@angular/material/chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogComponent } from "./rich-grid-example/dialog.component";
import { MatDialogModule, MatDatepickerInput, MatDatepicker, MatDatepickerModule, MatNativeDateModule } from "@angular/material";
import {MatInputModule} from '@angular/material';
import {MatMenuModule} from '@angular/material/menu';
import { ToastModule,  ToastOptions } from "ng2-toastr";
import { CustomOption } from "./Toast/CustomOption";


export function toastOptions(): ToastOptions {
    return {
        toastLife: 5000,
        dismiss: 'auto',
        showCloseButton: true,
        positionClass: 'toast-top-full-width',
        animate: 'fade',
        maxShown: 5,
        newestOnTop: true,
        enableHTML: true,
        messageClass: '',
        titleClass: ''
    };
}

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatIconModule,
        MatDialogModule,
        MatInputModule,
        MatDatepickerModule,
        MatDialogModule,
        MatSelectModule,
        MatChipsModule,
        MatNativeDateModule,
        MatToolbarModule,
        MatCardModule,        
        MatAutocompleteModule,
        MatMenuModule,
        JsonpModule,
        ToastModule.forRoot(),
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
        HeaderGroupComponent,DialogComponent,DialogOverviewExampleDialog
    ],
    providers: [ReportService, ProjectService,{provide: ToastOptions, useClass: CustomOption}],
    bootstrap: [AppComponent],
    entryComponents: [RichGridComponent, DialogOverviewExampleDialog],
    // entryComponents: [
    //     UpdateReportDialog
    //   ]
})
export class AppModule {
}
