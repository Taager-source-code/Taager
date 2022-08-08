import { Component, OnInit,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from 'src/app/presentation/shared/services/order.service';

interface OrderReq {
  currentRate: number;
  order: any;
}
@Component({
  selector: 'app-rating-bar',
  templateUrl: './rating-bar.component.html',
  styleUrls: ['./rating-bar.component.scss']
})
export class RatingBarComponent implements OnInit {
  public order = this.data.order;
  public complain: string = this.data.order.complain;
  public currentRate: number = this.data.currentRate;
  constructor(private orderService: OrderService,
    private dialogRef: MatDialogRef<RatingBarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrderReq,
    private toast: ToastrService) { }

  ngOnInit(): void {
  }

  onSubmitRating() {
    if(this.currentRate > 0) {
      if(this.complain || (!this.complain && this.currentRate > 3)) {
        if (this.currentRate > 3) {
          this.complain = '';
        }
        const updateObj = {
          rating: this.currentRate,
          complain: this.complain,
          orderID : this.order._id
        };
        this.orderService.rateOrder(updateObj).subscribe(()=> {
          this.dialogRef.close({rating: this.currentRate, complain: this.complain});
        });
      } else {
        this.toast.error('Ø¨Ø±Ø¬Ø§Ø¡ Ø§Ø®ØªÙŠØ§Ø± Ø³Ø¨Ø¨ Ø§Ù„ØªÙ‚ÙŠÙŠÙ…');
      }
    } else {
      this.toast.error('Ø¨Ø±Ø¬Ø§Ø¡ Ø§Ø®ØªÙŠØ§Ø± ØªÙ‚ÙŠÙŠÙ…');
    }
  }

  OnSelectRating(number: number) {
    this.currentRate = number;
  }

}


