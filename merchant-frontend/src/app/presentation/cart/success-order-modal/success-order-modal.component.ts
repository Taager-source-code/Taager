import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success-order-modal',
  templateUrl: './success-order-modal.component.html',
  styleUrls: ['./success-order-modal.component.scss']
})
export class SuccessOrderModalComponent {

  orderId = this.data;

  constructor(public dialogRef: MatDialogRef<SuccessOrderModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private router: Router) { }

  close(): void {
    this.dialogRef.close(true);
  }

  navigate(): void {
    this.dialogRef.close(false);
    this.router.navigate([`/orders/${this.orderId}`]);
  }

}


