import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public searchQuery = '';
  public image = '';
  private availableImages = ['sun.jpg', 'nature.jpg', 'sun2.jpg', 'water.jpg', 'solar.jpg']

  constructor(private router: Router) {
    this.image = this.availableImages[Math.floor(Math.random() * this.availableImages.length)];
  }

  ngOnInit(): void {
  }

  public search(): void {
    if (!this.searchQuery) return;
    this.router.navigate(['/plans', this.searchQuery]);
  }
}
