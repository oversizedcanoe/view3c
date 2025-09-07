import { Component } from '@angular/core';
import { Graph } from "../graph/graph";
import { GraphType } from '../../shared/enums';

@Component({
  selector: 'app-graph-container',
  imports: [Graph],
  templateUrl: './graph-container.html',
  styleUrl: './graph-container.css'
})
export class GraphContainer {
  public graphType = GraphType;
}
