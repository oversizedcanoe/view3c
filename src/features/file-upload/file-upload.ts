import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FileService } from '../../shared/file-service';
import { UploadType } from '../../shared/enums';

@Component({
  selector: 'app-file-upload',
  imports: [],
  templateUrl: './file-upload.html',
  styleUrl: './file-upload.css'
})
export class FileUpload implements AfterViewInit {
  @Input() uploadType!: UploadType;
  @Input() labelText: string = 'Upload File';

  constructor(public fileService: FileService) {
  }

  ngAfterViewInit(): void {
    window.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    window.addEventListener("drop", (e) => {
      e.preventDefault();
    });

    const dropZone = document.getElementById('dropZone' + this.uploadType);

    if (dropZone) {
      dropZone.addEventListener("drop", this.dropHandler.bind(this));
    }
  }

  dropHandler($event: DragEvent) {
    // Prevent default behavior (Prevent file from being opened)
    $event.preventDefault();

    if ($event.dataTransfer == null) {
      return;
    }

    for (let i = 0; i < $event.dataTransfer.items.length; i++) {
     const item = $event.dataTransfer.items[i];
     if (item.kind == 'file') {
        const file = item.getAsFile();
        console.log('test')
        if (file) {
          console.log(this);
          this.fileService.processFile(file, this.uploadType);
        }
     } 
    }
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
