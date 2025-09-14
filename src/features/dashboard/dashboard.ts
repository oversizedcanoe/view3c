import { Component } from '@angular/core';
import { FileUpload } from "../file-upload/file-upload";
import { UploadType } from '../../shared/enums';

@Component({
  selector: 'app-dashboard',
  imports: [FileUpload],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

  public UploadType = UploadType;

  async onCopyClicked() {
    const file = await fetch('/demo/Demo.log');
    const fileText = await file.text();

    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(fileText);
      alert('File contents copied!')
    }
    else {
      // Use the 'out of viewport hidden text area' trick
      const textArea = document.createElement("textarea");
      textArea.value = fileText;

      // Move textarea out of the viewport so it's not visible
      textArea.style.position = "absolute";
      textArea.style.left = "-999999px";

      document.body.prepend(textArea);
      textArea.select();

      try {
        document.execCommand('copy');
      } catch (error) {
        console.error(error);
        alert('Could not copy file contents. Try copying from the "view" link or downloading the log file.')
      } finally {
        textArea.remove();
        alert('File contents copied!')
      }
    }
  }
}
