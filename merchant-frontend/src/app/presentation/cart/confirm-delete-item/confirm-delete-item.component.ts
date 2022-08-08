import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-delete-item',
  templateUrl: './confirm-delete-item.component.html',
  styleUrls: ['./confirm-delete-item.component.scss']
})
export class ConfirmDeleteItemComponent  {

  constructor(public dialogRef: MatDialogRef<ConfirmDeleteItemComponent>) { }

  close(remove: boolean): void {
    this.dialogRef.close(remove);
  }


}


