import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { UploadType, w3cLogFields } from './enums';
import { w3cLog } from './models';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  fileNames: string[] = [];
  lines: string[] = [];
  file: any;
  logs: w3cLog[] = [];

  onFileLoaded: Subject<void> = new Subject();

  constructor() {
  }

  public getFileCount(): number {
    return this.fileNames.length;
  }

  public getLineCount(): number {
    return this.logs.length;
  }

  public getFileNames(): string[] {
    return this.fileNames;
  }
  
  public async processFile(file: File, uploadType: UploadType){
    const fileText = await file.text();
    this.processText(fileText, uploadType, file.name);
  }

  public processText(fileText: string, uploadType: UploadType, fileName: string): void {
    if (uploadType == UploadType.AddFile || uploadType == UploadType.AddText) {
      this.fileNames = [fileName];
      this.logs = [];
      const lines = fileText.split('\n');
      this.lines = lines;
      const logs: w3cLog[] = this.processLines(lines);
      this.logs = logs;
    }
    else if (uploadType == UploadType.AppendFile || uploadType == UploadType.AppendText) {
      if (uploadType == UploadType.AppendFile && this.fileNames.indexOf(fileName) > -1) {
        alert('This file has already been processed. Skipping.');
        return;
      }

      this.fileNames.push(fileName);
      this.fileNames.sort();
      const lines = fileText.split('\n');
      this.lines.push(...lines);
      const logs: w3cLog[] = this.processLines(lines);
      this.logs.push(...logs)
    }

    this.sortLogs();

    localStorage.setItem('fileNames', this.fileNames.join(','));
    localStorage.setItem('fileContents', this.lines.join('\n'));

    this.onFileLoaded.next();
  }

  public tryProcessLinesFromStorage() {
    const fileContents = localStorage.getItem('fileContents');
    const fileNames = localStorage.getItem('fileNames');

    if (fileContents != null && fileNames != null) {
      this.fileNames = fileNames.split(',');
      this.lines = fileContents.split('\n');
      this.logs = this.processLines(this.lines);
      this.sortLogs();
      this.onFileLoaded.next();
    }
  }

  private processLines(lines: string[]): w3cLog[] {
    let fieldList: string[] = [];
    let logs: w3cLog[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.substring(0, 7) == "#Fields") {
        fieldList = [];
        const headers: string[] = line.split(' ');
        for (let j = 1; j < headers.length; j++) {
          fieldList.push(headers[j].trim());
        }
      }
      else if (line[0] != "#") {
        const logFields: string[] = line.split(' ');

        if (line.trim() == '') {
          continue;
        }

        const log: w3cLog = {
          dateTime: new Date(logFields[fieldList.indexOf(w3cLogFields._date)] + 'T' + logFields[fieldList.indexOf(w3cLogFields._time)] + 'Z'),
          serverIp: logFields[fieldList.indexOf(w3cLogFields.serverIp)],
          clientMethod: logFields[fieldList.indexOf(w3cLogFields.clientMethod)],
          clientUriStem: logFields[fieldList.indexOf(w3cLogFields.clientUriStem)],
          clientUriQuery: logFields[fieldList.indexOf(w3cLogFields.clientUriQuery)],
          serverPort: parseInt(logFields[fieldList.indexOf(w3cLogFields.serverPort)]),
          clientUsername: logFields[fieldList.indexOf(w3cLogFields.clientUsername)],
          clientIp: logFields[fieldList.indexOf(w3cLogFields.clientIp)],
          clientUserAgent: logFields[fieldList.indexOf(w3cLogFields.clientUserAgent)],
          clientReferer: logFields[fieldList.indexOf(w3cLogFields.clientReferer)],
          serverStatus: parseInt(logFields[fieldList.indexOf(w3cLogFields.serverStatus)]),
          serverSubstatus: parseInt(logFields[fieldList.indexOf(w3cLogFields.serverSubstatus)]),
          serverWin32Status: parseInt(logFields[fieldList.indexOf(w3cLogFields.serverWin32Status)]),
          timeTaken: parseInt(logFields[fieldList.indexOf(w3cLogFields.timeTaken)]),
        }

        if (log.dateTime?.getTime() == null || isNaN(log.dateTime?.getTime())) {
          console.warn(`In valid line was found at index {${i}}`, line);
        }

        logs.push(log);
      }
    }

    return logs;
  }

  private sortLogs() {
    this.logs = this.logs.filter(l => l.dateTime != null).sort((l1, l2) => l1.dateTime!.getTime() - l2.dateTime!.getTime());;
  }

}
