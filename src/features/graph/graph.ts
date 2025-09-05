import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FileService } from '../../shared/file-service';
import * as echarts from 'echarts';
import { v4 as uuidv4 } from 'uuid';


@Component({
  selector: 'app-graph',
  imports: [],
  templateUrl: './graph.html',
  styleUrl: './graph.css'
})
export class Graph implements AfterViewInit {
  public uuid: string;

  constructor(public fileService: FileService) {
    this.uuid = uuidv4();
  }

  ngAfterViewInit(): void {
    // Create the echarts instance
    var myChart = echarts.init(document.getElementById(this.uuid));

    // Draw the chart
    myChart.setOption({
      title: {
        text: 'ECharts Getting Started Example'
      },
      tooltip: {},
      xAxis: {
        data: ['shirt', 'cardigan', 'chiffon', 'pants', 'heels', 'socks']
      },
      yAxis: {},
      series: [
        {
          name: 'sales',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }
      ]
    });

    window.addEventListener('resize', function () {
      myChart.resize();
    });

  }
}
