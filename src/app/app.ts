import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Dashboard } from "../features/dashboard/dashboard";
import { FileService } from '../shared/file-service';
import { SideMenu } from '../features/side-menu/side-menu';
import { GraphContainer } from '../features/graph-container/graph-container';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Dashboard, SideMenu, GraphContainer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('view3c');
  fileUploaded: boolean = false;

  constructor(private fileService: FileService) {

  }

  ngOnInit(): void {
    this.fileService.onFileLoaded.subscribe(() => {
      this.fileUploaded = true;
    });
    
    // To disable loading of files on app init, comment this out
    this.fileService.tryProcessLinesFromStorage();
  }

  ngOnDestroy(): void {
    this.fileService.onFileLoaded.unsubscribe();
  }
}
