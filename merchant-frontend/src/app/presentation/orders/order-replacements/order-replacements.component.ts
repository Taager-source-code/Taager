import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA,MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { COLOR_VARIANTS } from 'src/app/presentation/shared/constants/variants';
import { ProductService } from 'src/app/presentation/shared/services/product.service';
import { OrderIssuesService } from 'src/app/presentation/shared/services/orderIssues.service';

@Component({
  selector: 'app-order-replacements',
  templateUrl: './order-replacements.component.html',
  styleUrls: ['./order-replacements.component.scss']
})
export class OrderReplacementsComponent implements OnInit {
  public products= [];
  public product= {
    productObjectId : String,
    productQty : Number,
    productProfit : Number,
    productId: Number
  };
  public replaceOrderForm: FormGroup;
  public sameProductReplacement = true;
  public selectedIndex = 0;
  public clicked = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private productService: ProductService,
  private toastr: ToastrService,
  private orderIssuesService: OrderIssuesService,
  private dialogRef: MatDialogRef<OrderReplacementsComponent>) {
    this.replaceOrderForm = new FormGroup({
      product: new FormControl(),
      productQty: new FormControl(),
      issueReason: new FormControl(),
      phoneNum: new FormControl(),
      notes: new FormControl(),
      issueImage: new FormControl(),
      issueVideo: new FormControl()
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
          if(this.data.order.productProfits) {
this.products[index].productProfit = this.data.order.productProfits[index];
}
        }
      });
    }, (err) => {
    });
  }

  addQuantity(){
    if(this.replaceOrderForm.value.productQty<this.product.productQty) {
      this.replaceOrderForm.get('productQty').setValue(this.replaceOrderForm.value.productQty+1);
    }
  }
  removeQuantity(){
    if(this.replaceOrderForm.value.productQty>1) {
      this.replaceOrderForm.get('productQty').setValue(this.replaceOrderForm.value.productQty-1);
    }
  }

  onProductChange(event) {
    this.product = {
      productObjectId : event.value._id,
      productQty : event.value.productQuantity,
      productProfit : event.value.productProfit,
      productId : event.value.prodID,
    };
    this.replaceOrderForm.get('productQty').setValue(event.value.productQuantity);
  }

  public OpenFile(video) {
    if(video) {
document.getElementById('formControlVideo').click();
} else {
document.getElementById('formControlImage').click();
}
  }
  public onSendFile(event,video) {
    this.clicked=true;
    this.toastr.info('Uploading file');
    const {
      target: { name, files },
    } = event;
    const c = 0;
    const formData = new FormData();
    formData.append('image', files[0]);
    const filesize = ((files[0].size/1024)/1024).toFixed(4); // MB
    if( Number(filesize) < 15) {
    this.orderIssuesService.addIssueAttachment(formData).subscribe(
      (resp: any) => {
        this.clicked=false;
        this.toastr.success('Uploaded file');
        if(video) {
          this.replaceOrderForm.get('issueVideo').setValue(resp.msg);
        } else {
          this.replaceOrderForm.get('issueImage').setValue(resp.msg);
        }
      },
      (err) => {
        this.toastr.error(err.error.msg);
      }
    );
    } else {
      this.toastr.error('ÙŠØ¬Ø¨ Ø£Ù† ÙŠÙƒÙˆÙ† Ø­Ø¬Ù… Ø§Ù„Ù…Ù„Ù Ø£Ù‚Ù„ Ù…Ù† 15 Ù…ÙŠØºØ§ Ø¨Ø§ÙŠØª');
    }
  }

  submit() {
    if(!this.replaceOrderForm.value.product) {
      this.toastr.error('Ø§Ø®ØªØ± Ø§Ù„Ù…Ù†ØªØ¬ Ø§Ù„Ù…Ø±Ø§Ø¯ Ø§Ø³ØªØ¨Ø¯Ø§Ù„Ù‡');
      return 0;
    }
    if(this.clicked) {
      this.toastr.info('Uploading file');
      return 0;
    }
    if(!this.replaceOrderForm.value.issueVideo) {
      this.toastr.error('Ø¨Ø±Ø¬Ø§Ø¡ Ø±ÙØ¹ ÙÙŠØ¯ÙŠÙˆ ÙŠÙˆØ¶Ø­ Ø§Ù„Ù…Ø´ÙƒÙ„Ø© Ø¨Ø´ÙƒÙ„ Ø¹Ù…Ù„ÙŠ');
      return 0;
    }
    if(this.product.productQty < this.replaceOrderForm.value.productQty) {
      this.toastr.error('Ø§Ù„ÙƒÙ…ÙŠØ© Ø§Ù„Ù…Ø·Ù„ÙˆØ¨Ø© Ø£ÙƒØ«Ø± Ù…Ù† ÙƒÙ…ÙŠØ© Ø§Ù„Ø·Ù„Ø¨');
      return 0;
    }
    this.clicked = true;
    this.product.productQty = this.replaceOrderForm.value.productQty;
    const reqObj = {
      issueType : 2,
      order: {
        orderObjectId: this.data.order._id,
        OrderId : this.data.order.orderID,
      },
      product : this.product,
      issueReason : this.replaceOrderForm.value.issueReason,
      notes : this.replaceOrderForm.value.notes ? this.replaceOrderForm.value.notes: '',
      sameProductReplacement: this.selectedIndex==0 ? true: false ,
      issueImage : this.replaceOrderForm.value.issueImage ? this.replaceOrderForm.value.issueImage: '',
      issueVideo : this.replaceOrderForm.value.issueVideo ? this.replaceOrderForm.value.issueVideo: '',
    };

    this.orderIssuesService.addOrderReplacement(reqObj)
      .subscribe((res: any) => {
        this.dialogRef.close({ data: 'confirmed' });
        this.toastr.success('ØªÙ… Ø§Ø±Ø³Ø§Ù„ Ø§Ù„Ø·Ù„Ø¨ Ø¨Ù†Ø¬Ø§Ø­');
      }, (err) => {
        this.clicked = false;
      });
  }
}


