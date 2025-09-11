import { Component } from '@angular/core';
import { ChartType } from '../../shared/enums';
import { Chart } from '../chart/chart';

@Component({
  selector: 'app-graph-container',
  imports: [Chart],
  templateUrl: './graph-container.html',
  styleUrl: './graph-container.css'
})
export class GraphContainer {
  public chartType = ChartType;
}
