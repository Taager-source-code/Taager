import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ProductService } from 'src/app/presentation/shared/services/product.service';
import { ORDER_STATUSES } from 'src/app/presentation/shared/constants';
import { COLOR_VARIANTS } from 'src/app/presentation/shared/constants/variants';
import { ResponsiveService } from 'src/app/presentation/shared/services/responsive.service';

@Component({
  selector: 'app-child-order-item-dialog',
  templateUrl: './child-order-item-dialog.component.html',
  styleUrls: ['./child-order-item-dialog.component.scss']
})

export class ChildOrderItemDialogComponent implements OnInit {

  public OrderProds;
  public OrderProductPrices;
  public OrderProductQuantities;
  public Products = [];
  public isMobile = false;
  constructor(
    private dialog: MatDialog,
    private productService: ProductService,
    private responsiveService: ResponsiveService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.getIsMobile();
    this.OrderProds = this.data.childOrders
                        .reduce((acc: Array<string>, childOrder) => {
                          acc.push(childOrder.product.productObjectId);
                          return acc;
                        }, []);
    this.OrderProductPrices = this.data.childOrders
                        .reduce((acc: Array<string>, childOrder) => {
                          acc.push(childOrder.product.productPrice);
                          return acc;
                        }, []);
    this.OrderProductQuantities = this.data.childOrders
                        .reduce((acc: Array<string>, childOrder) => {
                          acc.push(childOrder.product.productQty);
                          return acc;
                        }, []);
    this.getProducts();
  }

  returnOrderStatus(recievedStatus: string): string{
    const statusObject = ORDER_STATUSES.ALL_STATUSES.filter(
      (status) => status.statusInEnglish === recievedStatus);
    return statusObject.length === 0 ? recievedStatus : statusObject[0].statusInArabic;
  };


  getChildOrderStatus(childOrderStatus: string): string {
    const statusObject = ORDER_STATUSES.ALL_STATUSES.filter(
      (status) => status.statusInEnglish === childOrderStatus);
    return statusObject.length === 0 ? childOrderStatus : statusObject[0].statusInArabic;
  };

  getChildOrderType(childOrderId: string): string {
    return ORDER_STATUSES.CHILD_ORDER_TYPE_MAP.get(childOrderId.charAt(0)) || '';
  };

  getIsMobile(): void {
    this.responsiveService.getMobileStatus().subscribe((isMobile) => {
      this.isMobile = isMobile;
    });
  }

  convertDate(mongo) {
    if (mongo) {
      const date = new Date(mongo);
      return date.toLocaleDateString('en-US');
    } else {
return '';
}
  }

  getProducts() {
    this.productService
      .getProductsByIds(this.OrderProds)
      .subscribe(async (res: any) => {
        this.Products = res.data.map(product => {
          const productColorHex = product.attributes.filter(attribute => attribute.type === 'color')[0]?.value;
          return {
            ...product,
            productColorHex,
            productColor: productColorHex && COLOR_VARIANTS.filter(variant => variant.color === productColorHex)[0]?.arabicColorName,
            productSize: product.attributes.filter(attribute => attribute.type === 'size')[0]?.value,
          };
        });
      });
  }

}


