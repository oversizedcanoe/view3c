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
    localStorage.setItem('fileContents', fileContents);
    
    if(uploadType == UploadType.Add){
      this.fileNames = [file.name];
      this.lines = fileContents.split('\n');
    } else if (uploadType == UploadType.Append){
      this.fileNames.push(file.name);
      this.lines.push(...fileContents.split('\n'));
    }

    this.onFileLoaded.next();
  }

  checkIfLinesInStorage() {
    const fileContents = localStorage.getItem('fileContents');
    
    if (fileContents != null){
      this.lines = fileContents.split('\n');
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
