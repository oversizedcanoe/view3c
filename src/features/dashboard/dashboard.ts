import { Component } from '@angular/core';
import { FileUpload } from "../file-upload/file-upload";

@Component({
  selector: 'app-dashboard',
  imports: [FileUpload],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

}
