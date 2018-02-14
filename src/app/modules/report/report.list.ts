import { Component,Input } from '@angular/core';

import {Report} from "./report";


@Component({
    selector: 'list-report',
    templateUrl:'app/modules/report/reportList.html'

})
export class ReportListComponent {
    @Input()
    report:Report[];
   }
