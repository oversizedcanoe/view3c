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
        const cutOff = percentile(98, logs.map(l => l.timeTaken)) as number;

        additionalContext = `Values in red indicate they are larger than the 98th percentile (${cutOff}ms).`

        chart.setOption({
          title: {
            text: 'Time Taken per Request (ms)'
          },
          tooltip: {},
          xAxis: {
            data: logs.map(l => this.formatDateForChart(l.dateTime)),
            name: 'Request DateTime',
            nameLocation: 'middle',
          },
          yAxis: {
            name: 'Time Taken (ms)',
            nameLocation: 'middle',
            max: cutOff
          },
          grid: {
            bottom: 100
          },
          series: [
            {
              name: 'time-taken',
              type: 'bar',
              data: logs.map(l => {

                return {
                  tooltip: `${l.timeTaken! > 1000 ? `${l.timeTaken!/1000}s` : `${l.timeTaken}ms`}
                  <br/>${this.formatDateForChart(l.dateTime)}
                  <br/>${l.clientMethod} ${l.clientUriStem}`,
                  value: l.timeTaken,
                  itemStyle: {
                    color: l.timeTaken != undefined && l.timeTaken <= cutOff ? 'blue' : 'red'
                  }
                }
              })
            }
          ],
          dataZoom: [
            {
              type: 'slider',
              yAxisIndex: 0,
              filterMode: 'none',
              startValue: 0,
              endValue: cutOff,
              width: 20
            },
            {
              type: 'slider',
              xAxisIndex: 0,
              filterMode: 'none',
              height: 20,
            }
          ],
        })
        break;
      case GraphType.RequestsPerMinute:
        //const cutOff = percentile(98, logs.map(l => l.timeTaken)) as number;
        //additionalContext = `Values in red indicate they are larger than the 98th percentile (${cutOff}ms).`
        const countsByDateTime: { [key: string]: number } = {};

        for (let i = 0; i < logs.length; i++) {
          const log = logs[i];
          const key = log.dateTime!.toString();
          countsByDateTime[key] = (countsByDateTime[key] || 0) + 1;
        }
       
        chart.setOption({
          title: {
            text: 'Requests per Minute'
          },
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            data: Object.keys(countsByDateTime).map(d=>this.formatDateForChart(new Date(d))),
            name: 'Request DateTime',
            nameLocation: 'middle',
          },
          yAxis: {
            name: 'Number of Requests',
            nameLocation: 'middle',
          },
          grid: {
            bottom: 100
          },
          series: [
            {
              name: 'Request Quantity',
              type: 'line',
              data: Object.values(countsByDateTime).map(count => {
                return {
                  tooltip: count,//`${l.timeTaken}ms<br/>${this.formatDateForChart(l.dateTime)}<br/>${l.clientMethod} ${l.clientUriStem}`,
                  value: count,
                }
              })
            }
          ],
          dataZoom: [
            {
              type: 'slider',
              xAxisIndex: 0,
              filterMode: 'none',
              height: 20,
            }
          ],
        })
        break;
      default:
        break;

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
