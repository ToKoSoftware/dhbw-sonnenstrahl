import { Component, OnInit } from '@angular/core';
import {profilePages} from '../profile.pages';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  public profilePages = profilePages;
  constructor() { }

  ngOnInit(): void {
  }

}
