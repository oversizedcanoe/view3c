import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { UploadType } from './enums';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  fileNames: string[] = [];
  lines: string[] = [];
  file: any;

  onFileLoaded: Subject<void> = new Subject();

  constructor(){
  }

 async processFile(file: File, uploadType: UploadType): Promise<void> {
  console.log('processFile,' , UploadType[uploadType])
    const fileContents = await file.text();
    
    if (uploadType == UploadType.Add){
      this.fileNames = [file.name];
      this.lines = fileContents.split('\n');
    } else if (uploadType == UploadType.Append){
      this.fileNames.push(file.name);
      this.lines.push(...fileContents.split('\n'));
    }

    localStorage.setItem('fileNames', this.fileNames.join(','));
    localStorage.setItem('fileContents', this.lines.join('\n'));

    this.onFileLoaded.next();
  }

  checkIfLinesInStorage() {
    const fileContents = localStorage.getItem('fileContents');
    const fileNames = localStorage.getItem('fileNames');
    
    if (fileContents != null && fileNames != null){
      this.lines = fileContents.split('\n');
      this.fileNames = fileNames.split(',');
      this.onFileLoaded.next();
    }
  }

  getFileCount(): number {
    return this.fileNames.length;
  }

  getLineCount(): number{
    return this.lines.length;
  }

  getFileNames(): string[]{
    return this.fileNames;
  }
}
