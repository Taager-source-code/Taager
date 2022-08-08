import { Component } from '@angular/core';
@Component({
  selector: 'ngx-actions-popover',
  template: `
    <nb-card class="popover-card">
      <nb-card-header status="warning">
        Hello!
      </nb-card-header>
      <nb-card-body>
        Far far away, behind the word mountains, far from the countries Vokalia and Consonantia,
        there live the blind texts.
        Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean.
      </nb-card-body>
    </nb-card>
  `,
  styles: [`
    nb-card {
      margin: 0;
      max-width: 20rem;
    }
  `],
})
export class TableActionsPopoverComponent {
}
