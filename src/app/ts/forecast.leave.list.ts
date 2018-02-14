import { Component,Input } from '@angular/core';

import {ForecastMonths} from "./ForecastMonths";


@Component({
    selector: 'list-forecast',
    templateUrl:'app/modules/leave/app.html'

})
export class ForecastListComponent {
    @Input()
    forecastLeaves:ForecastMonths[];
   }
