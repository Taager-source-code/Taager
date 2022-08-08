/* eslint-disable @typescript-eslint/naming-convention, no-underscore-dangle, radix */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { OrderService } from 'src/app/presentation/shared/services/order.service';
import { ProvinceService } from 'src/app/presentation/shared/services/province.service';
import { LocalStorageService } from 'src/app/presentation/shared/services/local-storage.service';
import { User } from 'src/app/presentation/shared/interfaces/user.interface';
import { ToastrService } from 'ngx-toastr';
import { UtilityService } from 'src/app/presentation/shared/services/utility.service';

declare let gtag;

@Component({
  selector: 'app-bulk-orders',
  templateUrl: './bulk-orders.component.html',
  styleUrls: ['./bulk-orders.component.scss'],
})
export class BulkOrdersComponent implements OnInit {
  @Input() orders: any;

  @Output() submitted: EventEmitter<any> = new EventEmitter();

  @Output() back: EventEmitter<any> = new EventEmitter();

  loading = false;
  provinces: any[] = [];
  public user: User;
  public ordersToSubmit = [];
  public retryOrders;
  public failedOrdersFlag;
  public isSubmitted = false;

  constructor(
    private orderService: OrderService,
    private provinceService: ProvinceService,
    private toastr: ToastrService,
    private localStorageService: LocalStorageService,
    private utilityService: UtilityService,
  ) { }


  ngOnInit(): void {
    this.provinceService.getProvinces().subscribe((res: any) => {
      this.provinces = res.data;
      this.generateOrders();
    });
  }

  generateOrders() {
    const count = this.orders.sort((x, y) => parseInt(y.id) - parseInt(x.id))[0]
      .id;

    for (let index = 1; index <= count; index++) {
      const orderList = this.orders.filter(
        (x) => x.id.toString() === index.toString()
      );

      const orderObject = {
        id: index,
        products: [],
        productQuantities: [],
        productPrices: [],
        orderProfit: 0,
        productIds: [],
        cashOnDelivery: 0,
        receiverName: orderList[0].receiverName,
        streetName: orderList[0].streetName,
        phoneNumber: orderList[0].phoneNumber,
        phoneNumber2: orderList[0].phoneNumber2,
        province: orderList[0].province,
        notes: orderList[0].notes,
        country: orderList[0].country,
        orderSource: {
          pageName: orderList[0].orderSource.pageName,
          pageUrl: orderList[0].orderSource.pageUrl,
        },
        status: 'draft',
        orderID: index,
      };

      orderList.forEach((product) => {
        orderObject.products.push(product.productObjectId);
        orderObject.productQuantities.push(product.productQty);
        orderObject.productPrices.push(
          +product.productNewPrice * +product.productQty
        );
        orderObject.orderProfit +=
          (+product.productNewPrice -
            product.productOriginalPrice +
            product.productProfit) *
          +product.productQty;
        orderObject.productIds.push(product.productId);
      });
      const total = this.countTotal(orderList);
      let shipping = 0;
      const orderData =
      {
        province: orderList[0].province.toString(),
        products: orderObject.products,
        productQuantities: orderObject.productQuantities,
        productPrices: orderObject.productPrices,
        productIds: orderObject.productIds,
      };
      this.orderService.calculateOrderCost(orderData).subscribe(res => {
        shipping = res.data.shipping.discountedRate;
        orderObject.cashOnDelivery = total.price + shipping;
        this.ordersToSubmit.push(orderObject);
      }, () => {
        this.toastr.error('Ù„Ù‚Ø¯ Ø­Ø¯Ø« Ø®Ø·Ø£ ÙÙŠ Ø­Ø³Ø§Ø¨ Ø§Ù„Ø§ÙˆØ±Ø¯Ø±!');
        shipping = this.provinces.find(
          (x) => x.location.toString() === orderList[0].province.toString()
        ).shippingRevenue;
        orderObject.cashOnDelivery = total.price + shipping;
        this.ordersToSubmit.push(orderObject);
      });
    }
  }

  public orderNow(): void {
    this.loading = true;

    this.getProfileData();

    const finalOrders = [];
    this.ordersToSubmit.forEach((val) =>
      finalOrders.push(Object.assign({}, val))
    );

    this.orderAll(finalOrders, finalOrders.length - 1);

    this.isSubmitted = true;
  }

  orderAll(finalOrders, index) {
    if (index < 0) {
      this.loading = false;
      return;
    } else {
      const element = finalOrders[index];

      delete element.id;
      delete element.orderID;
      delete element.status;

      this.orderService
        .orderCart(element)
        .pipe(
          finalize(() => {
            gtag('event', 'order', {
              event_category: 'ecommerce',
              event_label:
                'phoneNum:' +
                this.user.phoneNum +
                ', TagerID:' +
                this.user.TagerID,
            });
          })
        )
        .subscribe(
          (res) => {
            this.ordersToSubmit[index].orderID = res.order.orderID;
            this.ordersToSubmit[index].status = 'order_received';

            this.orderAll(finalOrders, index - 1);
          },
          (err) => {
            this.ordersToSubmit[index].orderID = 'error';
            this.ordersToSubmit[index].status = 'error';
            if (err?.error?.msg?.includes('spam behavior')) {
              this.ordersToSubmit[index].errorMessage = 'Ø¹Ø²ÙŠØ²ÙŠ Ø§Ù„ØªØ§Ø¬Ø± Ù„Ø§ÙŠÙ…ÙƒÙ† Ø¥Ø³ØªÙ„Ø§Ù… Ø§Ù„Ø·Ù„Ø¨ Ù„Ø£Ù† Ù‡Ø°Ø§ Ø§Ù„Ø¹Ù…ÙŠÙ„ Ù„Ù‡ ØªØ§Ø±ÙŠØ® Ù…Ù† Ø¥Ø³Ø§Ø¡Ø© Ø¥Ø³ØªØ®Ø¯Ø§Ù… Ø§Ù„Ù†Ø¸Ø§Ù… Ùˆ Ø¹Ø¯Ù… Ø¥Ø³ØªÙ„Ø§Ù… Ø§Ù„Ø·Ù„Ø¨Ø§Øª';
            } else {
              this.ordersToSubmit[index].errorMessage = err?.error?.msg || '';
            }

            this.failedOrdersFlag = true;
            this.orderAll(finalOrders, index - 1);
            if (err.status === 409 && err.error.msg === 'One or more products is not available') {
              this.toastr.error('Ø¨Ø¹Ø¶ Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª ØºÙŠØ± Ù…ØªÙˆÙØ±Ø© Ø­Ø§Ù„ÙŠÙ‹Ø§');
            }
          }
        );
    }
  }

  downloadRetryOrders() {
    const failedOrders = this.ordersToSubmit
      .filter((x) => x.orderID.toString() === 'error')
      .map((x) => x.id);

    this.retryOrders = this.orders.filter((x) => failedOrders.includes(x.id));

    const prods = this.retryOrders.map((x) => ({
      ÙƒÙˆØ¯_Ø§Ù„Ù…Ù†ØªØ¬: x.productId,
      Ø§Ø³Ù…_Ø§Ù„Ù…Ù†ØªØ¬: x.productName,
      Ø³Ø¹Ø±_Ø§Ù„Ù…Ù†ØªØ¬: x.productNewPrice,
      ÙƒÙ…ÙŠØ©: x.productQty,
      Ø§Ø³Ù…_Ø§Ù„Ø¹Ù…ÙŠÙ„: x.receiverName,
      Ø§Ù„Ù…Ø­Ø§ÙØ¸Ø©: x.province,
      Ø§Ù„Ø¹Ù†ÙˆØ§Ù†: x.streetName,
      Ø±Ù‚Ù…_Ø§Ù„Ù‡Ø§ØªÙ: `+20-${x.phoneNumber.substring(1)}`,
      Ø±Ù‚Ù…_Ø§Ù„Ù‡Ø§ØªÙ2: x.phoneNumber2.startsWith('+20-')
        ? x.phoneNumber2
        : `+20-${x.phoneNumber2.substring(1)}`,
      Ù…Ù„Ø§Ø­Ø¸Ø§Øª: x.notes,
      Ø§Ø³Ù…_ØµÙØ­Ø©_Ø§Ù„ÙÙŠØ³Ø¨ÙˆÙƒ: x.orderSource.pageName,
      Ù„ÙŠÙ†Ùƒ_Ø§Ù„ØµÙØ­Ø©: x.orderSource.pageUrl,
    }));

    if (!prods || !prods.length) {
      return;
    }
    this.utilityService.extractToExcel(prods, 'bulk_orders_retry.csv');
  }

  countTotal(products) {
    const total = products.reduce(
      (acc, item) => {
        acc.price += item.productNewPrice * item.productQty;
        acc.profit +=
          (item.productProfit +
            item.productNewPrice -
            item.productOriginalPrice) *
          item.productQty;
        acc.count += item.productQty;

        return acc;
      },
      {
        price: 0,
        profit: 0,
        count: 0,
      }
    );
    return total;
  }

  backToCart(): void {
    this.back.emit();
  }

  private getProfileData(): void {
    this.user = this.localStorageService.getUser();
  }
}


