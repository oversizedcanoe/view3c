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

  getFileCount(): number {
    return this.fileNames.length;
  }

  getLineCount(): number {
    return this.logs.length;
  }

  getFileNames(): string[] {
    return this.fileNames;
  }
  async processFile(file: File, uploadType: UploadType): Promise<void> {
    const fileContents = await file.text();

    if (uploadType == UploadType.Add) {
      this.fileNames = [file.name];
      const lines = fileContents.split('\n');
      this.processLines(lines);
      this.lines = lines;
    }
    else if (uploadType == UploadType.Append) {
      if (this.fileNames.indexOf(file.name) > -1) {
        alert('This file has already been processed. Skipping.');
        return;
      }
      this.fileNames.push(file.name);
      const lines = fileContents.split('\n');
      this.processLines(lines);
      this.lines.push(...lines);
    }

    localStorage.setItem('fileNames', this.fileNames.join(','));
    localStorage.setItem('fileContents', this.lines.join('\n'));

    this.onFileLoaded.next();
  }

  checkIfLinesInStorage() {
    const fileContents = localStorage.getItem('fileContents');
    const fileNames = localStorage.getItem('fileNames');

    if (fileContents != null && fileNames != null) {
      this.fileNames = fileNames.split(',');
      this.lines = fileContents.split('\n');
      this.processLines(this.lines);
      this.onFileLoaded.next();
    }
  }

  private processLines(lines: string[]) {
    let fieldList: string[] = [];

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

        this.logs.push(log);
      }
    }
  }

}
