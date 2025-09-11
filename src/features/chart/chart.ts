import { AfterViewInit, Component, Input } from '@angular/core';
import { FileService } from '../../shared/file-service';
import * as echarts from 'echarts';
import { v4 as uuidv4 } from 'uuid';
import { ChartType } from '../../shared/enums';
import { ChartService } from '../../shared/chart-service';


@Component({
  selector: 'app-chart',
  imports: [],
  templateUrl: './chart.html',
  styleUrl: './chart.css'
})
export class Chart implements AfterViewInit {
  @Input() chartType!: ChartType;
  public uuid: string;
  public additionalContext: string = '';
  public chart!: echarts.ECharts;

  constructor(private chartService: ChartService, private fileService: FileService) {
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
    this.additionalContext = this.chartService.createGraph(this.chartType, this.chart);
    window.addEventListener('resize',  () => {
      this.chart.resize();
    });
  }
}
