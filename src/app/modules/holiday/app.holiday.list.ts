import { Component,Input } from '@angular/core';

import {Holiday} from "./Holiday";


@Component({
    selector: 'list-holidays',
    templateUrl:'app/modules/holiday/holidayslist.html'

})
export class HolidayComponent {
    @Input()
    holidaylist:Holiday[];
   }


