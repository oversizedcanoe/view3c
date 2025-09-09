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

  public UploadType = UploadType;

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
        if (file) {
          // If multiple files are dropped and the UploadType is "Add", pass it 
          // with that parameter. Otherwise, even if this is an "Add" type, pass "Append",
          // to allow multiple files to be processed
          const uploadType = i == 0 ? this.uploadType : UploadType.AppendFile;
          this.fileService.processFile(file, uploadType);
        }
     } 
    }
  }

  onFileUploaded($event: Event) {
    const inputElement = $event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      for (let i = 0; i < inputElement.files.length; i++) {
        const file = inputElement.files[i];
        // If multiple files are dropped and the UploadType is "Add", pass it 
        // with that parameter. Otherwise, even if this is an "Add" type, pass "Append",
        // to allow multiple files to be processed
        const uploadType = i == 0 ? this.uploadType : UploadType.AppendFile;
        this.fileService.processFile(file, uploadType);
      }
    }
  }

  onSubmitClicked(){
    const element = document.getElementById('textarea'+this.uploadType) as HTMLTextAreaElement;
    const fileText = element.value;
    element.value = "";

    const textUploadFileName = "Text Upload";
    const textUploadCount = this.fileService.fileNames.filter(f=>f.startsWith(textUploadFileName)).length;

    this.fileService.processText(fileText, this.uploadType, `${textUploadFileName} ${textUploadCount+1}`)
  }
}
