import { Injectable } from '@angular/core';
import { FileService } from './file-service';
import * as echarts from 'echarts';
import { w3cLog } from './models';
import percentile from 'percentile';
import { ChartType } from './enums';

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  constructor(private fileService: FileService) {

  }

  createGraph(chartType: ChartType, chart: echarts.ECharts): string {
    let additionalContext: string = '';
    let logs: w3cLog[] = this.fileService.logs;

    switch (chartType) {
      case ChartType.TimeTaken:
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
                  tooltip: `${l.timeTaken! > 1000 ? `${l.timeTaken! / 1000}s` : `${l.timeTaken}ms`}
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
      case ChartType.RequestsPerMinute:
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
            data: Object.keys(countsByDateTime).map(d => this.formatDateForChart(new Date(d))),
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
      case ChartType.RequestsPerEndpoint:
        let countsByEndpoint: { [key: string]: number } = {};

        for (let i = 0; i < logs.length; i++) {
          const log = logs[i];
          const key = log.clientUriStem!;
          countsByEndpoint[key] = (countsByEndpoint[key] || 0) + 1;
        }

        countsByEndpoint = Object.keys(countsByEndpoint)
          .sort((a, b) => a.localeCompare(b))
          .reduce((acc, key) => {
            acc[key] = countsByEndpoint[key];
            return acc;
          }, {} as { [key: string]: number });

        chart.setOption({
          title: {
            text: 'Requests per Endpoint'
          },
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            data: Object.keys(countsByEndpoint),
            name: 'Query',
            nameLocation: 'middle',
            axisLabel: {
              rotate: 90,      // rotate labels 45 degrees
              interval: 0,     // 0 = show all labels
              formatter: (val: string) => val // optional, for formatting
            }
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
              data: Object.values(countsByEndpoint).map(count => {
                return {
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
      case ChartType.StatusCodeFrequency:
        const countsByHttpCode: { [key: string]: number } = {};

        for (let i = 0; i < logs.length; i++) {
          const log: w3cLog = logs[i];
          if (log.serverStatus == null) {
            continue;
          }

          const key = log.serverStatus;
          countsByHttpCode[key] = (countsByHttpCode[key] || 0) + 1;
        }

        console.warn(countsByHttpCode);

        // Two dimensional array.
        // Index in outer array represents the HTTP Status Category - index 0 = 1xx,
        // index 1 = 2xx, index 2 = 3xx etc
        // The inner array is a list of counts per specific HTTP Status: i.e., [4, 10, 1]
        // means 4x one code, 10x one code, 1x one code
        // The specific code matches the index in countsByHttpCode for that category
        // holy shit this is complicated  
        const rawData2: number[][] = [];

        // 1xx through 5xx
        for (let i = 0; i < 5; i++) {
          rawData2.push([]);
        }

        let longestRowLength = 0;

        Object.keys(countsByHttpCode).forEach((httpCodeProperty) => {
          const httpCode: number = parseInt(httpCodeProperty);
          const count = countsByHttpCode[httpCode];
          const httpStatusCodeCategory: number = parseInt(httpCode.toString()[0]);
          const correctRowInArray = rawData2[httpStatusCodeCategory-1];
          correctRowInArray.push(count);

          if(correctRowInArray.length > longestRowLength){
            longestRowLength = correctRowInArray.length;
          }
        });

        console.warn(rawData2);


        const totalData: number[] = [];
        for (let i = 0; i < rawData2[0].length; ++i) {
          let sum = 0;
          for (let j = 0; j < rawData2.length; ++j) {
            sum += rawData2[j][i];
          }
          totalData.push(sum);
        }

        const series: any[] = [];


        for(let i = 0; i < longestRowLength; i++){
          let row = [];

          series.push({
            type: 'bar',
            stack: 'total',
            barWidth: '60%',
            label: {
              show: true,
              formatter: (params: any) => params.value
            },
            data: 
            rawData2[i].map((d, did) =>d)
          });
        }

        // for (let i = 0; i < rawData2.length; i++) {
        //   series.push({
        //     type: 'bar',
        //     stack: 'total',
        //     barWidth: '60%',
        //     label: {
        //       show: true,
        //       formatter: (params: any) => params.value
        //     },
        //     data: rawData2[i].map((d, did) =>d)
        //   });
        // }

        chart.setOption({
          title: {
            text: 'Requests by Status Code'
          },
          legend: {
            selectedMode: false
          },
          yAxis: {
            type: 'value'
          },
          xAxis: {
            type: 'category',
            data: ['1xx', '2xx', '3xx', '4xx', '5xx']
          },
          series
        });
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

  // getHttpStatusCategory(statusCode: number | undefined): number {
  //   if (statusCode) {
  //     return parseInt(statusCode.toString()[0]);
  //   }
  //   return 0;
  // }
}
