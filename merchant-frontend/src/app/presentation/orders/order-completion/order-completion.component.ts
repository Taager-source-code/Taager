import { Component, OnInit ,Inject} from '@angular/core';

import { MAT_DIALOG_DATA,MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';

import { FormGroup, FormControl } from '@angular/forms';

import { COLOR_VARIANTS } from 'src/app/presentation/shared/constants/variants';

import { ProductService } from 'src/app/presentation/shared/services/product.service';

import { OrderIssuesService } from 'src/app/presentation/shared/services/orderIssues.service';

@Component({

  selector: 'app-order-completion',

  templateUrl: './order-completion.component.html',

  styleUrls: ['./order-completion.component.scss']

})

export class OrderCompletionComponent implements OnInit {

  public products= [];

  public product= {

    productObjectId : String,

    productQty : Number,

    productProfit : Number,

    productId: Number

  };

  public completeOrderForm: FormGroup;

  public clicked = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,

  private productService: ProductService,

  private toastr: ToastrService,

  private orderIssuesService: OrderIssuesService,

  private dialogRef: MatDialogRef<OrderCompletionComponent>) {

    this.completeOrderForm = new FormGroup({

      product: new FormControl(),

      productQty: new FormControl(),

      issueReason: new FormControl(),

      phoneNum: new FormControl(),

      notes: new FormControl(),

    });

    dialogRef.disableClose = false;

  }

  ngOnInit(): void {

    this.productService.getProductsByIds(this.data.order.products).subscribe((res: any) => {

      this.products = res.data;

      let productColorName;

      let productSize;

      this.products.forEach((element,index)=>{

        if (element.attributes && element.attributes.length > 0) {

          const colorObject = element.attributes.filter(

            (attribute) => attribute.type === 'color'

          )[0];

          const filteredColor = COLOR_VARIANTS.filter(

            (color) => colorObject.value === color.color

          )[0];

          productColorName = filteredColor ? filteredColor.arabicColorName : '';

          productSize = element.attributes.filter(

            (attribute) => attribute.type === 'size'

          )[0]?.value;

          this.products[index].productName = `${this.products[index].productName}${

            productColorName ? ', ' + productColorName : ''

          }${productSize ? ', ' + productSize : ''}`;

        }

        if(this.data.order.products[index].toString() == element._id.toString()) {

          this.products[index].productQuantity = this.data.order.productQuantities[index];

          this.products[index].productProfit = this.data.order.productProfits[index];

        }

      });

    }, (err) => {

    });

  }

  addQuantity(){

    if(this.completeOrderForm.value.productQty<this.product.productQty) {

      this.completeOrderForm.get('productQty').setValue(this.completeOrderForm.value.productQty+1);

    }

  }

  removeQuantity(){

    if(this.completeOrderForm.value.productQty>1) {

      this.completeOrderForm.get('productQty').setValue(this.completeOrderForm.value.productQty-1);

    }

  }

  onProductChange(event) {

    this.product = {

      productObjectId : event.value._id,

      productQty : event.value.productQuantity,

      productProfit : event.value.productProfit,

      productId : event.value.prodID,

    };

    this.completeOrderForm.get('productQty').setValue(event.value.productQuantity);

  }

  submit() {

    if(!this.completeOrderForm.value.product) {

      this.toastr.error('اختر المنتج المناسب لاستكمال الطلب');

      return 0;

    }

    if(this.product.productQty < this.completeOrderForm.value.productQty) {

      this.toastr.error('الكمية المطلوبة أكثر من كمية الطلب');

      return 0;

    }

    if(!this.completeOrderForm.value.notes) {

      this.toastr.error(' يجب إضافة أي ملاحظات لتوضيح المشكلة');

      return 0;

    }

    this.clicked = true;

    this.product.productQty = this.completeOrderForm.value.productQty;

    const reqObj = {

      issueType : 3,

      order: {

        orderObjectId: this.data.order._id,

        OrderId : this.data.order.orderID,

      },

      product : this.product,

      notes : this.completeOrderForm.value.notes,

    };

    this.orderIssuesService.addOrderCompletion(reqObj)

      .subscribe((res: any) => {

        this.dialogRef.close({ data: 'confirmed' });

        this.toastr.success('تم ارسال الطلب بنجاح');

      }, (err) => {

        this.clicked = false;

      });

  }

}


