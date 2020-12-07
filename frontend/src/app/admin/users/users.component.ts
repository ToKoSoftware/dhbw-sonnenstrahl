import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {UiButtonGroup} from '../../ui/ui.interface';
import {ApiService} from '../../services/api/api.service';
import {UserData} from '../../interfaces/user.interface';
import {adminBreadcrumb, adminPages} from '../admin.pages';
import {ConfirmModalService} from '../../services/confirm-modal/confirm-modal.service';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';
import {ModalService} from '../../services/modal/modal.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  public sidebarPages = adminPages;
  public breadcrumb = adminBreadcrumb;
  @ViewChild('editModal', {static: true}) editModal: TemplateRef<unknown>;
  public results: UserData[] = [];
  public loading = false;
  public currentEditUser: UserData;
  public buttonGroup: UiButtonGroup = {
    buttons: [
      {
        title: 'Benutzerdaten exportieren',
        function: () => {
        },
        icon: 'download-cloud'
      }
    ]
  };

  constructor(
    private confirmService: ConfirmModalService,
    private loadingService: LoadingModalService,
    private modalService: ModalService,
    private api: ApiService) {
  }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading = true;
    this.api.get<UserData[]>('/users', {}).subscribe(
      data => {
        this.loading = false;
        this.results = data.data;
      }
    );
  }

  public async showDeleteModalForUser(user: UserData): Promise<void> {
    const confirmed = await this.confirmService.confirm({
      title: `Sicher, dass Sie den User mit der E-Mail "${user.email}" entfernen möchten?`,
      description: 'Dies kann nicht rückgängig gemacht werden.'
    });
    if (confirmed) {
      this.loadingService.showLoading();
      this.api.delete<{ success: boolean } | { success: boolean, error: string }>(`/users/${user.id}`).subscribe(
        data => {
          this.loadData();
          this.loadingService.hideLoading();
        },
        error => {
          this.loadingService.hideLoading();
          this.confirmService.confirm({
            title: `Es ist ein Fehler beim Löschen aufgetreten.`,
            confirmButtonType: 'info',
            confirmText: 'Ok',
            description: 'Der Server gab folgenden Fehler an: ' + error.error.data.error,
            showCancelButton: false
          });
        }
      );
    }
  }

  public showEditModalForUser(user: UserData): void {
    this.currentEditUser = {...user};
    this.modalService.showModal(`"${user.email} " bearbeiten`, this.editModal);
  }

  public closeEditModal(): void {
    this.modalService.close();
  }


  public saveEditedUser(): void {
    this.modalService.close();
    this.loadingService.showLoading();
    this.api.put(`/users/${this.currentEditUser.id}`, {
      email: this.currentEditUser.email,
    }).subscribe(
      data => {
        this.loadingService.hideLoading();
        this.loadData();
      }, error => {
        this.loadingService.hideLoading();
        this.confirmService.confirm({
          title: `Es ist ein Fehler beim Ändern aufgetreten.`,
          confirmButtonType: 'info',
          confirmText: 'Ok',
          description: 'Der Server gab folgenden Fehler an: ' + error.error.data.error,
          showCancelButton: false
        });
      }
    );
  }
}
