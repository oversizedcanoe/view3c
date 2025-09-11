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
        // Index 0 = 1xx
        // Index 1 = 2xx
        // etc
        const rawData = [
          // [0] is: Number of 1xx for the first xx
          // [1] is: Number of 1xx for the next xx
          // [2] is: Number of 1xx for the next xx
          [1000, 334,],


          // [0] is: Number of 2xx for the first xx
          // [1] is: Number of 2xx for the next xx
          // [2] is: Number of 2xx for the next xx
          [101, 134,],


          [191, 234,],
          [201, 154,],
          [901, 934,]
        ];

        const rawData2: number[] = [];



        const totalData: number[] = [];
        for (let i = 0; i < rawData[0].length; ++i) {
          let sum = 0;
          for (let j = 0; j < rawData.length; ++j) {
            sum += rawData[j][i];
          }
          totalData.push(sum);
        }

        const series: any[] = []
        for (let i = 0; i < rawData.length; i++) {
          series.push({
            type: 'bar',
            stack: 'total',
            barWidth: '60%',
            label: {
              show: true,
              formatter: (params: any) => Math.round(params.value * 1000) / 10 + '%'
            },
            data: rawData[i].map((d, did) =>
              totalData[did] <= 0 ? 0 : d / totalData[did]
            )
          });
        }

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
}
