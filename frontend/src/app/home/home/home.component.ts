import {Component} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent {
  public searchQuery = '';
  public image = '';
  private availableImages = ['sun.jpg', 'nature.jpg', 'sun2.jpg', 'water.jpg', 'solar.jpg'];

  constructor(private router: Router) {
    // add random background image
    this.image = this.availableImages[Math.floor(Math.random() * this.availableImages.length)];
  }

  /**
   * Change route to search page
   */
  public search(): void {
    if (!this.searchQuery) return;
    this.router.navigate(['/plans', this.searchQuery]);
  }
}
