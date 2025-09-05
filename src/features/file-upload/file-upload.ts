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

  constructor(public fileService: FileService) {
  }

  ngOnInit(): void {
    window.addEventListener("dragover", (e) => {
      e.preventDefault();
    });
    window.addEventListener("drop", (e) => {
      e.preventDefault();
    });
  }

  onFileUploaded($event: Event) {
    const inputElement = $event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const selectedFile = inputElement.files[0]; // Get the first selected file
      // You can now work with the selectedFile (e.g., upload it, display its name, etc.)
      this.fileService.processFile(selectedFile, this.uploadType);
    }
  }

}
