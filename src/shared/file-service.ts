import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  fileName: string = '';
  lines: string[] = [];
  file: any;

  onFileLoaded: Subject<void> = new Subject();

  constructor(){
  }

 async processFile(file: File): Promise<void> {
    this.fileName = file.name;
    const fileContents = await file.text();
    localStorage.setItem('fileContents', fileContents);
    this.lines = fileContents.split('\n');
    this.onFileLoaded.next();
  }

  checkIfLinesInStorage() {
    const fileContents = localStorage.getItem('fileContents');
    
    if (fileContents != null){
      this.lines = fileContents.split('\n');
      this.onFileLoaded.next();
    }
  }
}
