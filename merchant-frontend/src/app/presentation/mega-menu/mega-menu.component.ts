import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-mega-menu',
  templateUrl: './mega-menu.component.html',
  styleUrls: ['./mega-menu.component.scss']
})
export class MegaMenuComponent implements OnInit {

  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  hoveredCategoryId: string;
  shouldDisplaySideMenu = false;
  constructor() { }

  ngOnInit(): void {
  }

  onCategoryHovered(categoryId: string) {
    this.hoveredCategoryId = categoryId;
    this.shouldDisplaySideMenu = true;
  }

}


