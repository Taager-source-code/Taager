import { Component, OnInit, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';

import { OrderService } from 'src/app/presentation/shared/services/order.service';

interface OrderIssueStatusReq {

  status: string;

  objectId: string;

  orderObjectId: string;

  orderId: string;

  issueType: number;

}

@Component({

  selector: 'app-cancel-order-issue-dialog',

  templateUrl: './cancel-order-issue-dialog.component.html',

  styleUrls: ['./cancel-order-issue-dialog.component.scss']

})

export class CancelOrderIssueDialogComponent implements OnInit {

  public reqObj = {} as OrderIssueStatusReq;

  constructor(

    private toastr: ToastrService,

    private orderService: OrderService,

    private dilogRef: MatDialogRef<CancelOrderIssueDialogComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any

  ) {}

  ngOnInit(): void {}

  updateStatus() {

    this.reqObj.status = 'merchant_cancelled';

    this.reqObj.objectId = this.data.orderIssue._id;

    this.reqObj.orderObjectId = this.data.orderIssue.order.orderObjectId;

    this.reqObj.orderId = this.data.orderIssue.order.OrderId;

    this.reqObj.issueType = this.data.orderIssue.issueType;

    this.orderService.cancelOrderIssue(this.reqObj).subscribe(() => {

      this.dilogRef.close(true);

      this.toastr.success('تم إلغاء مشكلة الطلب بنجاح');

    }, () => {});

  }

}
