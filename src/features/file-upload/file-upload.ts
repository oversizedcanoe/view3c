import { Component, Input, OnInit } from '@angular/core';
import { FileService } from '../../shared/file-service';
import { UploadType } from '../../shared/enums';

@Component({
  selector: 'app-file-upload',
  imports: [],
  templateUrl: './file-upload.html',
  styleUrl: './file-upload.css'
})
export class FileUpload implements OnInit {
  @Input() uploadType!: UploadType;
  @Input() labelText: string = 'Upload File';
  
  constructor(public fileService: FileService){
  }

  ngOnInit(): void {
  console.log('ngOnInit raw uploadType =', this.uploadType);
  console.log('ngOnInit resolved =', UploadType[this.uploadType]);
  }

  onFileUploaded($event: Event) {
    console.log('onFileUploaded with label = ', this.labelText)
    const inputElement = $event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const selectedFile = inputElement.files[0]; // Get the first selected file
      // You can now work with the selectedFile (e.g., upload it, display its name, etc.)
      this.fileService.processFile(selectedFile, this.uploadType);
    }
  }

}
