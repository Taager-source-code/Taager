import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from 'src/app/presentation/shared/services/order.service';
import { ProductService } from 'src/app/presentation/shared/services/product.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MixpanelService } from 'src/app/presentation/shared/services/mixpanel.service';


interface OrderStatusReq {
  status: string;
  notes: string;
  orders: any[];
}
@Component({
  selector: 'app-cancel-order-dialog',
  templateUrl: './cancel-order-dialog.component.html',
  styleUrls: ['./cancel-order-dialog.component.scss']
})
export class CancelOrderDialogComponent implements OnInit {

  public cancelOrderStatusForm: FormGroup;
  public reqObj = {} as OrderStatusReq;
  products: any[] = [];

  constructor(private toastr: ToastrService,
    private mixpanelService: MixpanelService,
    private orderService: OrderService,
    private productService: ProductService,
    private dilogRef: MatDialogRef<CancelOrderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder
  ) {

    this.cancelOrderStatusForm = new FormGroup({
      notes: new FormControl()
    });

    this.productService.getProductsByIds(this.data.order.products).subscribe((res: any) => {
      this.products = res.data;

    }, (err) => {

    });


  }

  ngOnInit(): void {
    this.reqObj.orders = [];
  }

 /*  calculateProductQtyStatus(productRunningQty, productQuantityResubmit) {
    if (!productQuantityResubmit || productQuantityResubmit == 0)
      productQuantityResubmit = 100;
    let runQty = parseInt(productRunningQty);
    let resQty = parseInt(productQuantityResubmit);
    let high = environment.HIGH_QTY * resQty / 100;
    let low = environment.LOW_QTY * resQty / 100;
    if (runQty >= high)
      return 'available_with_high_qty'
    else if ((runQty < high && runQty > low))
      return 'available'
    else if (runQty < low && runQty > 0)
      return 'available_with_low_qty'
    else { //if(productRunningQty==0)
      return 'not_available'
    }
  } */

  updateStatus() {
    this.reqObj.notes = this.cancelOrderStatusForm.value.notes;
    this.reqObj.status = 'taager_cancelled';
    this.reqObj.orders.push(this.data.order);
    this.mixpanelService.track('Order_canceled', {
      'Order Id': this.data.order.orderID,
      Status: this.data.order.status,
      Reasoning: this.cancelOrderStatusForm.value.notes,
      'Shipping Company': this.data.order.shippingInfo && this.data.order.shippingInfo.company? this.data.order.shippingInfo.company : 'No company'
    });
    this.orderService.cancelOrder(this.reqObj)
      .subscribe((res: any) => {

       /*  this.products.forEach((product, index) => {
          product.reserved -= this.data.order.productQuantities[index];
          product.productRunningQuantity = parseInt(product.productRunningQuantity) + parseInt(this.data.order.productQuantities[index]);
          product.productQuantityStatus = this.calculateProductQtyStatus(product.productRunningQuantity, product.productQuantityResubmit);
        });

        this.productService.updateProducts(this.products)
          .subscribe((res: any) => {
            // this.toastr.success(res.msg);
          }, (err) => {
            //this.toastr.error(err.error.msg);
          });
 */
        this.dilogRef.close();
        this.toastr.success('ØªÙ… Ø¥Ù„ØºØ§Ø¡ Ø§Ù„Ø·Ù„Ø¨ Ø¨Ù†Ø¬Ø§Ø­');
        /*  if (environment.ENABLE_MAIL_SEND)
           this.orderService.sendOrderChangeNotifications(this.reqObj)
             .subscribe((res: any) => {
               // this.toastr.success('ØªÙ… Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø¨Ù†Ø¬Ø§Ø­');
             }, (err) => {
               //this.toastr.error(err.error.msg);
             }); */
      }, (err) => {
      });
  }



}


