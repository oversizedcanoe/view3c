import { Injectable } from '@angular/core';
import { FileService } from './file-service';
import { GraphType } from './enums';
import * as echarts from 'echarts';


@Injectable({
  providedIn: 'root'
})
export class GraphService {

  constructor(private fileService: FileService){

  }

  createGraph(graphType: GraphType, chart: echarts.ECharts) {
    switch(graphType){
      case GraphType.TimeTaken:
        chart.setOption({
      title: {
        text: 'Time Taken'
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
    })
    }
  }
  
}
