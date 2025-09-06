import { Injectable } from '@angular/core';
import { FileService } from './file-service';
import { GraphType } from './enums';
import * as echarts from 'echarts';
import { w3cLog } from './models';
import percentile from 'percentile';
 

@Injectable({
  providedIn: 'root'
})
export class GraphService {

  constructor(private fileService: FileService) {

  }

  createGraph(graphType: GraphType, chart: echarts.ECharts): string {
    let additionalContext: string = '';
    let logs: w3cLog[] = this.fileService.logs;

    switch (graphType) {
      case GraphType.TimeTaken:
        const cutOff = percentile(98.9, logs.map(l => l.timeTaken)) as number;
        additionalContext = `Values in red indicate they are larger than the 98.9th percentile (${cutOff}ms).`
        chart.clear();
        chart.setOption({
          title: {
            text: 'Time Taken'
          },
          tooltip: {},
          xAxis: {
            data: logs.map(l => this.formatDateForChart(l.dateTime)),
            name: 'Request DateTime'
          },
          yAxis: {
            name: 'Time Taken (ms)',
            max: cutOff,
          },
          series: [
            {
              name: 'time-taken',
              type: 'bar',
              data: logs.map(l => {

                return {
                  tooltip: `${l.timeTaken}ms<br/>${this.formatDateForChart(l.dateTime)}<br/>${l.clientMethod} ${l.clientUriStem}`,
                  value: l.timeTaken,
                  itemStyle:{
                    color: l.timeTaken != undefined && l.timeTaken <= cutOff ? 'blue' : 'red'
                  }
                }
                })
            }
          ]
        })
    }
    return additionalContext;
  }

  formatDateForChart(date: Date | undefined): string {
    if (date == undefined) {
      return '';
    }

    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  }
}
