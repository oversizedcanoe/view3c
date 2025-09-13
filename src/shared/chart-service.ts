import { Injectable } from '@angular/core';
import { FileService } from './file-service';
import * as echarts from 'echarts';
import { HTTP_STATUS_CODE_DICT, w3cLog } from './models';
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
        const countsByHttpCodeCategory: { [key: string]: number } = {};

        let totalRequests: number = 0;
        
        for (let i = 0; i < logs.length; i++) {
          const log: w3cLog = logs[i];
          if (log.serverStatus == null) {
            continue;
          }

          const key = log.serverStatus;
          countsByHttpCode[key] = (countsByHttpCode[key] || 0) + 1;

          const category = key.toString()[0];
          countsByHttpCodeCategory[category] = (countsByHttpCodeCategory[category] || 0) + 1;

          totalRequests++;
        }

        const percentagesByHttpCodeCategory:{ [key: string]: string  } = {};
        const formattedCountsByCategory: {[key: string]: string } = {};

        Object.keys(countsByHttpCodeCategory).forEach((category) => {
          percentagesByHttpCodeCategory[category] = ((countsByHttpCodeCategory[category] / totalRequests) * 100).toFixed(2);
    
          let counts: string[] = [];
          let totalForCategory: number = 0;

          Object.keys(countsByHttpCode).filter(c=>c.startsWith(category)).forEach((httpCode) => {
            const count = countsByHttpCode[httpCode];
            counts.push(`${httpCode} ${HTTP_STATUS_CODE_DICT[httpCode]}: ${count}`);
            totalForCategory += count;
          });

          formattedCountsByCategory[category] = counts.join('<br>') + `<br><br><i>Total: ${totalForCategory} (${percentagesByHttpCodeCategory[category]}%)</i>`;
        });

        const colorByCategory:  {[key: string]: string } = {
          '1': 'rgba(78, 72, 255, 0.54)', // blue: info
          '2': 'rgba(72, 255, 96, 0.54)', // green: success
          '3': 'rgba(252, 255, 72, 0.54)', // yellow: redirect, i.e. caution
          '4': 'rgba(255, 145, 72, 0.54)', // orange: bad, user fault
          '5': 'rgba(255, 72, 72, 0.54)', // red: bad, your fault
        }

        const descriptionByCategory: {[key: string]: string } = {
          '1': 'Information', // blue: info
          '2': 'Success', // green: success
          '3': 'Redirect', // yellow: redirect, i.e. caution
          '4': 'Client Error', // orange: bad, user fault
          '5': 'Server Error', // red: bad, your fault
        }

        chart.setOption({
          title: {
            text: 'Requests by Status Code',
            left: 'center'
          },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            left: 'left'
          },
          series: [
            {
              name: 'HTTP Status Code Category',
              type: 'pie',
              radius: '50%',
              data: Object.keys(countsByHttpCodeCategory).map((category, index) => ({
                value: countsByHttpCodeCategory[category],
                name: category + 'xx ' + descriptionByCategory[category],
                tooltip: `<b>HTTP Status Code ${category}xx ${descriptionByCategory[category]}</b><br>${formattedCountsByCategory[category]}`,
                label: {
                  formatter: category + "xx",
                  position: 'inside',
                  color: 'black'
                },
                itemStyle: {
                  color: colorByCategory[category],
                }
              })),
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
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
