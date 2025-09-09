import { Component, OnInit } from '@angular/core';
import { FileUpload } from "../file-upload/file-upload";
import { FileService } from '../../shared/file-service';
import { UploadType } from '../../shared/enums';

@Component({
  selector: 'app-side-menu',
  imports: [FileUpload],
  templateUrl: './side-menu.html',
  styleUrl: './side-menu.css'
})
export class SideMenu implements OnInit {
  public filesUploaded: number = 0;
  public linesUploaded: number = 0;
  public fileNamesUploaded: string[] = [];

  public UploadType = UploadType;

  constructor(private fileService: FileService) {
    this.setFileMetaData();
  }

  ngOnInit(): void {
    this.fileService.onFileLoaded.subscribe(() =>{
      this.setFileMetaData();
    })
  }

  setFileMetaData(){
    this.linesUploaded = this.fileService.getLineCount();
    this.fileNamesUploaded = this.fileService.getFileNames();
  }

  clearStorage(){
    window.localStorage.clear();
    window.location.reload();
  }
}
