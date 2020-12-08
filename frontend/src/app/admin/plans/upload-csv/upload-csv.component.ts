import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-upload-csv',
  templateUrl: './upload-csv.component.html',
  styleUrls: ['./upload-csv.component.scss']
})
export class UploadCsvComponent implements OnInit {
  files: any = [];

  uploadFile(event: any): void {
    // tslint:disable-next-line:prefer-for-of
    for (let index = 0; index < event.length; index++) {
      const element = event[index];
      this.files.push(element.name);
    }
  }

  deleteAttachment(index: any): void {
    this.files.splice(index, 1);
  }

  constructor() {
  }

  ngOnInit(): void {
  }

}
