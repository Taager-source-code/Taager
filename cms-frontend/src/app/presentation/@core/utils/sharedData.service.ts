import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
@Injectable({
    providedIn: 'root',
})
export class SharedDataService {
    imgUrl: string = environment.imgUrl;
    sidebarCollapsed = false;
}
