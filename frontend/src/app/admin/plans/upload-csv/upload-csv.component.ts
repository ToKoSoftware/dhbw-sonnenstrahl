import {Component, OnInit} from '@angular/core';
import {ModalService} from '../../../services/modal/modal.service';
import {FileUploadService} from '../../../services/file-upload/file-upload.service';
import {PlanDataPreview} from '../../../interfaces/plan.interface';
import {ConfirmModalService} from '../../../services/confirm-modal/confirm-modal.service';

@Component({
  selector: 'app-upload-csv',
  templateUrl: './upload-csv.component.html',
  styleUrls: ['./upload-csv.component.scss']
})
export class UploadCsvComponent implements OnInit {
  private fileToUpload: File | null = null;
  public files: FileList | null = null;
  public uploading = false;

  constructor(
    private modalService: ModalService,
    private readonly confirm: ConfirmModalService,
    private fileUploadService: FileUploadService) {
  }

  public handleFileChange(files: FileList): void {
    console.log("File Change", files);
    this.files = files;
    this.fileToUpload = files.item(0);
  }

  public saveFile(): void {
    if (this.fileToUpload === null) {
      console.log('File Upload failed');
      return;
    }
    this.uploading = true
    this.fileUploadService.upload<PlanDataPreview[]>('/plans', this.fileToUpload, 'put')
      .subscribe(
        async data => {
          this.modalService.close();
          await this.confirm.confirm({
            title: `Import erfolgreich abgeschlossen.`,
            confirmButtonType: 'info',
            confirmText: 'Ok',
            description: data.data.length + ' Tarife wurden importiert.',
            showCancelButton: false
          });
          window.location.reload();
        },
        error => {
          this.modalService.close();
          this.confirm.confirm({
            title: `Es ist ein Fehler beim Daten-Import aufgetreten.`,
            confirmButtonType: 'info',
            confirmText: 'Ok',
            description: 'Der Server gab folgenden Fehler an: ' + error.error.data.error,
            showCancelButton: false
          });
        }
      );
  }

  deleteAttachment(index: any): void {
    this.files = null;
  }

  ngOnInit(): void {
  }

  public closeModal(): void {
    this.modalService.close();
  }

}
