import { AfterViewInit, Component, Input } from '@angular/core';
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
  public additionalContext: string = '';
  public chart!: echarts.ECharts;

  constructor(private graphService: GraphService, private fileService: FileService) {
    this.uuid = uuidv4();
      
    this.fileService.onFileLoaded.subscribe(() =>{
      this.createChart();
    })
  }

  ngAfterViewInit(): void {
    this.createChart();
  }

  createChart(){
    this.chart = echarts.init(document.getElementById(this.uuid));
    this.additionalContext = this.graphService.createGraph(this.graphType, this.chart);
    window.addEventListener('resize',  () => {
      this.chart.resize();
    });
  }
}
