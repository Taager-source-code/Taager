import { Component } from '@angular/core';
import { SharedAPIService } from '@presentation/shared/shared-apis/sharedapi.service';
@Component({
  selector: 'ngx-protected-page',
  templateUrl: './protected-page.component.html',
  styleUrls: ['./protected-page.component.scss'],
})
export class ProtectedPageComponent {
  imgUrl: string;
  constructor(private sharedService: SharedAPIService) {
    this.imgUrl = this.sharedService.imgUrl;
   }
}
