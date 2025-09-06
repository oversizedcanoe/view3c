import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FileService } from '../../shared/file-service';
import * as echarts from 'echarts';
import { v4 as uuidv4 } from 'uuid';
import { GraphType } from '../../shared/enums';
import { GraphService } from '../../shared/graph-service';


@Component({
  selector: 'app-graph',
  imports: [],
  templateUrl: './graph.html',
  styleUrl: './graph.css'
})
export class Graph implements AfterViewInit {
  @Input() graphType!: GraphType;
  public uuid: string;

  constructor(private graphService: GraphService) {
    this.uuid = uuidv4();
  }

  ngAfterViewInit(): void {
    // Create the echarts instance
    var myChart = echarts.init(document.getElementById(this.uuid));
    this.graphService.createGraph(this.graphType, myChart);
    window.addEventListener('resize', function () {
      myChart.resize();
    });
  }
}
