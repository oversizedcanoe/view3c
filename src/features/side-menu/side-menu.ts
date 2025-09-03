import { Component } from '@angular/core';
import { FileUpload } from "../file-upload/file-upload";

@Component({
  selector: 'app-side-menu',
  imports: [FileUpload],
  templateUrl: './side-menu.html',
  styleUrl: './side-menu.css'
})
export class SideMenu {

}
