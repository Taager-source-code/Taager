import { Component, Input } from '@angular/core';

@Component({

  selector: 'loader',

  templateUrl: './loader.component.html',

  styleUrls: [ './loader.component.scss'],

})

export class LoaderComponent {

  @Input() loading = false;

  @Input() size = 'sm';

}
