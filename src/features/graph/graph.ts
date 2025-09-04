import { Component } from '@angular/core';
import { FileService } from '../../shared/file-service';

@Component({
  selector: 'app-graph',
  imports: [],
  templateUrl: './graph.html',
  styleUrl: './graph.css'
})
export class Graph {

  public lines: string[ ] = []

  constructor(public fileService: FileService){
    for (let index = 0; index < fileService.logs.length; index++) {
      const element = fileService.logs[index];
      this.lines.push(JSON.stringify(element));
    }
  }
}
