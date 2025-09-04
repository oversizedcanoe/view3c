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

}
