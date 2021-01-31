import {Component, ElementRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {LoginService} from '../../services/login/login.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  @ViewChild('inputEl') inputElement: ElementRef<HTMLInputElement>;
  public searchQuery = '';

  constructor(
    public login: LoginService,
    private router: Router) {
  }

  /**
   * Redirect to search overview page and reset search input field
   */
  public search(): void {
    this.router.navigate(['/plans', this.searchQuery]);
    this.searchQuery = '';
    this.inputElement.nativeElement.blur();
  }
}
