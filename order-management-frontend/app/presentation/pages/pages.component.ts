import { Component } from '@angular/core';
import { IconsService } from '../@core/utils/icons.service';
import { NbMenuItem } from '@nebular/theme';
import { MENU_ITEMS } from './pages-menu';
@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent {
  menu: NbMenuItem[];
  constructor(
    private iconsService: IconsService,
  ) {
    this.iconsService.registerTaagerPackIcons();
    this.menu = MENU_ITEMS;
  }
}
