import { Component, OnInit ,Inject} from '@angular/core';
import { MAT_DIALOG_DATA,MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { COLOR_VARIANTS } from 'src/app/presentation/shared/constants/variants';
import { ProductService } from 'src/app/presentation/shared/services/product.service';
import { OrderIssuesService } from 'src/app/presentation/shared/services/orderIssues.service';

@Component({
  selector: 'app-order-refunds',
  templateUrl: './order-refunds.component.html',
  styleUrls: ['./order-refunds.component.scss']
})
export class OrderRefundsComponent implements OnInit {
  public products= [];
  public product= {
    productObjectId : String,
    productId : String,
    productQty : Number,
    productProfit : Number,
  };
  public refundOrderForm: FormGroup;
  public clicked = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private productService: ProductService,
  private toastr: ToastrService,
  private orderIssuesService: OrderIssuesService,
  private dialogRef: MatDialogRef<OrderRefundsComponent>) {
    this.refundOrderForm = new FormGroup({
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
  addQuantity(){
    if(this.refundOrderForm.value.productQty<this.product.productQty) {
      this.refundOrderForm.get('productQty').setValue(this.refundOrderForm.value.productQty+1);
    }
  }
  removeQuantity(){
    if(this.refundOrderForm.value.productQty>1) {
      this.refundOrderForm.get('productQty').setValue(this.refundOrderForm.value.productQty-1);
    }
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
  public OpenFile(video) {
    if(video) {
document.getElementById('formControlVideo').click();
} else {
document.getElementById('formControlImage').click();
}
  }
  public onSendFile(event,video) {
    this.clicked = true;
    this.toastr.info('Uploading file');
    const {
      target: { name, files },
    } = event;
    const c = 0;
    const formData = new FormData();
    formData.append('image', files[0]);
    const filesize = ((files[0].size/1024)/1024).toFixed(4); // MB
    if (Number(filesize) < 15) {
    this.orderIssuesService.addIssueAttachment(formData).subscribe(
      (resp: any) => {
        this.clicked = false;
        this.toastr.success('Uploaded file');
        if(video) {
          this.refundOrderForm.get('issueVideo').setValue(resp.msg);
        } else {
          this.refundOrderForm.get('issueImage').setValue(resp.msg);
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
  onProductChange(event) {
    this.product = {
      productObjectId : event.value._id,
      productQty : event.value.productQuantity,
      productProfit : event.value.productProfit,
      productId : event.value.prodID,
    };
    this.refundOrderForm.get('productQty').setValue(event.value.productQuantity);
  }

  private validatePhoneNum(phoneNum) {
    if (!phoneNum || phoneNum === '') {
      this.toastr.error('ÙŠØ¬Ø¨ Ù…Ù„Ø¡ Ø®Ø§Ù†Ø© Ø±Ù‚Ù… Ø§Ù„Ù…ÙˆØ¨Ø§ÙŠÙ„');
      return false;
    }
    if (phoneNum.length > 11) {
      this.toastr.error('Ø±Ù‚Ù… Ø§Ù„Ù…ÙˆØ¨Ø§ÙŠÙ„ Ø§ÙƒØ¨Ø± Ù…Ù† 11 Ø±Ù‚Ù… - ÙŠØ¬Ø¨ Ø§Ù† ÙŠØ­ØªÙˆÙŠ Ø¹Ù„Ù‰ 11 Ø±Ù‚Ù…');
      return false;
    }
    if (phoneNum.length < 11) {
      this.toastr.error('Ø±Ù‚Ù… Ø§Ù„Ù…ÙˆØ¨Ø§ÙŠÙ„ Ø§Ù‚Ù„ Ù…Ù† 11 Ø±Ù‚Ù… - ÙŠØ¬Ø¨ Ø§Ù† ÙŠØ­ØªÙˆÙŠ Ø¹Ù„Ù‰ 11 Ø±Ù‚Ù…');
      return false;
    }
    if (!(phoneNum.startsWith('01'))) {
      this.toastr.error('ÙŠØ¬Ø¨ Ø§Ù† ÙŠØ¨Ø¯Ø£ Ø±Ù‚Ù… Ø§Ù„Ù…ÙˆØ¨Ø§ÙŠÙ„ Ø¨ 01');
      return false;
    }
    if (/\s/.test(phoneNum)) {
      this.toastr.error('ÙŠØ¬Ø¨ Ø§Ù„Ø§ ÙŠØ­ØªÙˆÙ‰ Ø±Ù‚Ù… Ø§Ù„Ù…ÙˆØ¨Ø§ÙŠÙ„ Ø¹Ù„Ù‰ Ø§ÙŠ Ù…Ø³Ø§ÙØ§Øª');
      return false;
    }
    if (!(/^(01)[0-9]{9}$/.test(phoneNum))) {
      this.toastr.error('Ø±Ù‚Ù… Ø§Ù„Ù…ÙˆØ¨Ø§ÙŠÙ„ ØºÙŠØ± ØµØ­ÙŠØ­ ÙˆÙŠØ¬Ø¨ Ø§Ù† Ù„Ø§ ÙŠÙƒÙˆÙ† Ø¨Ø§Ù„Ù„ØºØ© Ø§Ù„ØºØ±Ø¨ÙŠØ©');
      return false;
    }
    return true;
  }

  submit() {
    if(!this.refundOrderForm.value.product) {
      this.toastr.error('Ø§Ø®ØªØ± Ø§Ù„Ù…Ù†ØªØ¬ Ø§Ù„Ù…Ø±Ø§Ø¯ Ø§Ø³ØªØ±Ø¬Ø§Ø¹Ù‡');
      return 0;
    }
    if(this.product.productQty < this.refundOrderForm.value.productQty) {
      this.toastr.error('Ø§Ù„ÙƒÙ…ÙŠØ© Ø§Ù„Ù…Ø·Ù„ÙˆØ¨Ø© Ø£ÙƒØ«Ø± Ù…Ù† ÙƒÙ…ÙŠØ© Ø§Ù„Ø·Ù„Ø¨');
      return 0;
    }
    if(!this.refundOrderForm.value.issueReason){
      this.toastr.error('Ø§Ù„Ø±Ø¬Ø§Ø¡ Ø§Ø®ØªÙŠØ§Ø± Ø³Ø¨Ø¨ Ø§Ù„Ø§Ø³ØªØ±Ø¬Ø§Ø¹');
      return 0;
    }
    if(this.clicked) {
      this.toastr.info('Uploading file');
      return 0;
    }
    if(!this.refundOrderForm.value.issueVideo) {
      this.toastr.error('Ø¨Ø±Ø¬Ø§Ø¡ Ø±ÙØ¹ ÙÙŠØ¯ÙŠÙˆ ÙŠÙˆØ¶Ø­ Ø§Ù„Ù…Ø´ÙƒÙ„Ø© Ø¨Ø´ÙƒÙ„ Ø¹Ù…Ù„ÙŠ');
      return 0;
    }
    if(! this.validatePhoneNum(this.refundOrderForm.value.phoneNum)){
      return 0;
    }
    this.clicked = true;
    this.product.productQty = this.refundOrderForm.value.productQty;
    const reqObj = {
      issueType :1,
      order: {
        orderObjectId: this.data.order._id,
        OrderId : this.data.order.orderID,
      },
      product : this.product,
      issueReason : this.refundOrderForm.value.issueReason,
      notes : this.refundOrderForm.value.notes,
      phoneNum : this.refundOrderForm.value.phoneNum,
      issueImage: this.refundOrderForm.value.issueImage,
      issueVideo : this.refundOrderForm.value.issueVideo ? this.refundOrderForm.value.issueVideo: '',
    };

    this.orderIssuesService.addOrderRefund(reqObj)
      .subscribe((res: any) => {
        this.dialogRef.close({ data: 'confirmed' });
        this.toastr.success('ØªÙ… Ø§Ø±Ø³Ø§Ù„ Ø§Ù„Ø·Ù„Ø¨ Ø¨Ù†Ø¬Ø§Ø­');
      }, (err) => {
        this.clicked = false;
        this.toastr.error('Ø±ØµÙŠØ¯ Ø§Ù„Ù…Ø­ÙØ¸Ø© ØºÙŠØ± ÙƒØ§Ù');
      });
  }

}


