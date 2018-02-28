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

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
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
        HeaderGroupComponent
    ],
    providers: [ReportService, ProjectService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
