/* eslint-disable @typescript-eslint/naming-convention, no-underscore-dangle */
import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { OrderService } from '../../services/order.service';
import { ProvinceService } from '../../services/province.service';
import { COLOR_VARIANTS } from 'src/app/presentation/shared/constants/variants';
import { LocalStorageService } from 'src/app/presentation/shared/services/local-storage.service';
import { User } from 'src/app/presentation/shared/interfaces/user.interface';
import { MultitenancyService } from 'src/app/presentation/shared/services/multitenancy.service';
import { DropdownSettings } from 'angular2-multiselect-dropdown/lib/multiselect.interface';
import { Province } from 'src/app/presentation/shared/interfaces/province.interface';
import { MULTITENANCY_CONSTS } from 'src/app/presentation/shared/constants';
import { MixpanelService } from '../../services/mixpanel.service';
import { ProvinceValidatorService } from '../../services/province-validator.service';

declare let gtag;

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
  @Input() products: any;

  @Input() product: any;

  @Input() isOrderNow: boolean;

  @Input() orderFromProduct: boolean;

  @Output() submitted: EventEmitter<any> = new EventEmitter();

  @Output() back: EventEmitter<any> = new EventEmitter();

  loading = false;
  shippingCost = 0;
  isShippingCalculated = false;
  offerBonus = 0;
  offer = {
    name: 'Ø¹ÙŠØ¯ Ù…ÙŠÙ„Ø§Ø¯ ØªØ§Ø¬Ø±',
    categoryId: '5eb48aef61695654ba6c7b9a',
    bonusCases: [
      { from: 150, to: 250, bonus: 5 },
      { from: 250, to: 350, bonus: 10 },
      { from: 350, to: 500, bonus: 15 },
      { from: 500, to: Infinity, bonus: 25 },
    ],
  };
  deliveryDur = '';
  orderForm: FormGroup;
  dropdownClosed = true;
  public total = {
    price: 0,
    profit: 0,
    count: 0,
  };
  promotionEntitled = false;
  public user: User;
  currency: string;
  public provincesDropdownSettings: DropdownSettings;
  public provinceList: Province[];
  public selectedProvince: Province;
  constructor(
    private orderService: OrderService,
    private mixpanelService: MixpanelService,
    private provinceService: ProvinceService,
    private localStorageService: LocalStorageService,
    private provinceValidatorService: ProvinceValidatorService,
    private multitenancyService: MultitenancyService,
  ) {
    this.createForm();
  }
  ngOnInit(): void {
    this.setupProvincesDropdownListSettings();
    this.provinceService.getProvinces().subscribe((res: any) => {
      this.provinceList = res.data.map(province => ({
        ...province,
        provinceGroupLabel: `- ${province.branch} -`
      }));
    });

    if (this.orderFromProduct) {
      this.orderForm.addControl(
        'quantity',
        new FormControl(this.products[0].quantity, [Validators.required, Validators.min(1)])
      );
      const price = this.products[0].customPrice ? this.products[0].customPrice : this.products[0].productPrice;
      this.orderForm.addControl(
        'price',
        new FormControl(price, [Validators.required])
      ); // Validators.min(this.product.productPrice)
    }

    this.countTotal();

    this.calculateOfferBonus({ offer: this.offer });

    this.setProductsVariants();

    const isMultitenancyEnabled = this.multitenancyService.isMultitenancyEnabled();
    this.currency = isMultitenancyEnabled ? this.multitenancyService.getCurrentCountry().currency.arabicName : 'Ø¬Ù†ÙŠÙ‡ Ù…ØµØ±ÙŠ';
  }

  setProductsVariants(): void {
    this.products = this.products.map((product) => {
      const productColorHex = product.attributes.filter(attribute => attribute.type === 'color')[0]?.value;
      return {
        ...product,
        productColorHex,
        productColor: productColorHex && COLOR_VARIANTS.filter(variant => variant.color === productColorHex)[0].arabicColorName,
        productSize: product.attributes.filter(attribute => attribute.type === 'size')[0]?.value,
      };
    });
  }

  calculateOfferBonus = ({ offer }) => {
    const taagerProducts = [];
    this.products.forEach((prod) => {
      if (prod.categoryId === offer.categoryId) {
        taagerProducts.push(prod);
      }
    });
    let totalNewPrice = 0;
    if (this.orderFromProduct) {
      if (!this.total.price) {
        this.offerBonus = 0;
      }
      if (taagerProducts.length) {
        totalNewPrice = this.total.price;
      }
    } else {
      totalNewPrice = taagerProducts.reduce((a, b) => a + +b.newPrice * +b.quantity, 0);
    }
    if (
      totalNewPrice >= offer.bonusCases[0].from &&
      totalNewPrice < offer.bonusCases[0].to
    ) {
      this.offerBonus = offer.bonusCases[0].bonus;
    } else if (
      totalNewPrice >= offer.bonusCases[1].from &&
      totalNewPrice < offer.bonusCases[1].to
    ) {
      this.offerBonus = offer.bonusCases[1].bonus;
    } else if (
      totalNewPrice >= offer.bonusCases[2].from &&
      totalNewPrice < offer.bonusCases[2].to
    ) {
      this.offerBonus = offer.bonusCases[2].bonus;
    } else if (
      totalNewPrice >= offer.bonusCases[3].from &&
      totalNewPrice < offer.bonusCases[3].to
    ) {
      this.offerBonus = offer.bonusCases[3].bonus;
    }
  };

  get province(): AbstractControl {
    return this.orderForm.get('province');
  }

  get isInvalid(): boolean {
    return this.province && this.province.invalid && !this.province.pristine;
  }

  get totalPrice(): number {
    let totPrice = 0;
    if (this.isOrderNow) {
      const { price, quantity } = this.orderForm.value;
      totPrice = +price * +quantity;
    } else {
      totPrice = this.products.reduce((a, b) => a + +b.newPrice * +b.quantity, 0);
    }

    return totPrice + this.shippingCost;
  }

  createForm(): void {
    const phoneValidators = this.multitenancyService.getCurrentCountry().isoCode2 === MULTITENANCY_CONSTS.EGYPT_ISOCODE_2 ? [
      Validators.required,
      Validators.minLength(11),
      Validators.maxLength(11),
      Validators.pattern('^(01)[0-9]*$'),
    ] : [Validators.required, Validators.pattern('^[0-9]*$')];
    this.orderForm = new FormGroup({
      receiverName: new FormControl('', [Validators.required]),
      province: new FormControl(null, [
        Validators.required,
        this.provinceValidatorService.provinceNameValidator()
      ]),
      streetName: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', phoneValidators),
      phoneNumber2: new FormControl(''),
      notes: new FormControl(''),
      orderSource: new FormGroup({
        pageName: new FormControl(''),
        pageUrl: new FormControl(''),
      })

    });
  }

  onSubmit(): void {
    if (this.orderForm.invalid) {
      this.setUpMixpanel('Order_Completion', false);
      this.markFormGroupTouched(this.orderForm);
      return;
    } else {
      this.loading = true;
      if (this.isOrderNow) {
        this.orderNow();
      } else {
        this.orderCart();
      }
    }
  }

  countTotal(): void {
    // TODO:
    const { price, quantity } = this.orderForm.value;
    if (this.isOrderNow) {
      let profit;
      if (price < this.product.productPrice) {
        const remainProfit =
          this.product.productProfit - (this.product.productPrice - price);
        if (remainProfit >= 0) {
          profit = remainProfit * +quantity;
        }
      } else if (price > this.product.productPrice) {
        profit =
          (this.product.productProfit + +price - this.product.productPrice) *
          +quantity;
      } else {
        // console.log(typeof this.product.productProfit, typeof this.product.productPrice);
        profit =
          (this.product.productProfit + +price - this.product.productPrice) *
          +quantity;
      }
      this.total = {
        price: price * +quantity,
        profit,
        count: +quantity,
      };
      const singleProfit = this.profitByProducts(
        this.product.productProfit,
        this.product.productPrice,
        this.orderForm.get('price').value
      );
      if (
        this.product.productPrice - +this.orderForm.get('price').value >
        singleProfit &&
        +this.orderForm.get('quantity').value >= 10
      ) {
        this.orderForm.controls.price.setErrors({ invalid: true });
      } else if (
        +this.orderForm.get('price').value < this.product.productPrice &&
        +this.orderForm.get('quantity').value < 10
      ) {
        this.orderForm.controls.price.setErrors({ invalid: true });
      } else {
        this.orderForm.controls.price.setErrors(null);
      }
    } else if (this.orderFromProduct) {
      this.products[0].quantity = quantity;
      let profit;
      if (price < this.products[0].productPrice) {
        const remainProfit =
          this.products[0].productProfit -
          (this.products[0].productPrice - price);
        if (remainProfit >= 0) {
          profit = remainProfit * +quantity;
        }
      } else if (price > this.products[0].productPrice) {
        profit =
          (this.products[0].productProfit +
            +price -
            this.products[0].productPrice) *
          +quantity;
      } else {
        // console.log(typeof this.product.productProfit, typeof this.product.productPrice);
        profit =
          (this.products[0].productProfit +
            +price -
            this.products[0].productPrice) *
          +quantity;
      }
      this.total = {
        price: price * +quantity,
        profit,
        count: +quantity,
      };
      this.calculateOfferBonus({ offer: this.offer });
      const singleProfit = this.profitByProducts(
        this.products[0].productProfit,
        this.products[0].productPrice,
        this.orderForm.get('price').value
      );
      if (
        this.products[0].productPrice - +this.orderForm.get('price').value >
        singleProfit &&
        +this.orderForm.get('quantity').value >= 10
      ) {
        this.orderForm.controls.price.setErrors({ invalid: true });
      } else if (
        +this.orderForm.get('price').value < this.products[0].productPrice &&
        +this.orderForm.get('quantity').value < 10
      ) {
        this.orderForm.controls.price.setErrors({ invalid: true });
      } else {
        this.orderForm.controls.price.setErrors(null);
      }
      this.calculateShippingCost();
    } else {
      this.total = this.products.reduce(
        (acc, item) => {
          acc.price += item.newPrice * item.quantity;
          acc.profit +=
            (item.productProfit + item.newPrice - item.productPrice) *
            item.quantity;
          acc.count += item.quantity;

          return acc;
        },
        {
          price: 0,
          profit: 0,
          count: 0,
        }
      );
    }
  }

  backToCart(): void {
    this.back.emit();
  }

  profitByProducts(profit: number, price: number, newPrice: number): number {
    if (newPrice < price) {
      return profit;
    }
    return newPrice - price + profit;
  }

  enableZeroProfit() {
    const profit = this.profitByProducts(
      this.product.productProfit,
      this.product.productPrice,
      this.orderForm.get('price').value
    );
    let zeroProfit = 0;
    const newPrice = this.orderForm.get('price').value;
    if (newPrice > this.product.productPrice) {
      zeroProfit = newPrice - profit;
    } else {
      zeroProfit = this.product.productPrice - profit;
    }
    this.orderForm.get('price').setValue(zeroProfit);
    this.countTotal();
  }

  setupProvincesDropdownListSettings() {
    this.provincesDropdownSettings = {
      enableSearchFilter: true,
      text: 'Ø§Ø®ØªØ± Ø§Ù„Ù…Ø­Ø§ÙØ¸Ø©',
      searchPlaceholderText: 'Ø¨Ø­Ø«',
      singleSelection: true,
      enableCheckAll: false,
      maxHeight: 280,
      lazyLoading: false,
      showCheckbox: false,
      position: 'bottom',
      autoPosition: false,
      escapeToClose: false,
      primaryKey: 'location',
      labelKey: 'location',
    };
  }

  onProvinceChange(): void {
    this.calculateShippingCost();
  }

  calculateShippingCost(): void {
    const orderData =
    {
      province: this.province.value && this.province.value[0]?.location,
      products: this.products.map(product => product.id),
      productQuantities: this.products.map(product => product.quantity),
      productPrices: this.products.map(product => product.productPrice),
      productIds: this.products.map(product => product.pid),
    };
    this.isShippingCalculated = false;
    this.promotionEntitled = false;
    this.shippingCost = 0;
    if (orderData.province) {
      this.orderService.calculateOrderCost(orderData).subscribe(res => {
        this.shippingCost = res.data.shipping.discountedRate;
        if (this.shippingCost === 0) {
          this.promotionEntitled = true;
        }
        this.isShippingCalculated = true;
      }, () => {
        this.shippingCost = 0;
      });
    }
  }

  private setUpMixpanel(event_name, status) {
    const errors = [];
    const index = 0;
    if (status) {
      this.mixpanelService.track(event_name, {
        'Number of Products': this.products.length,
        'Total Products': this.total.count,
        'Payment Amount': this.total.price + this.shippingCost,
        Status: 'Success',
      });
    } else {
      errors[0] = {
        field: 'notes',
        status: this.orderForm.controls.notes.status,
      };
      errors[1] = {
        field: 'Phone Number',
        status: this.orderForm.controls.phoneNumber.status,
      };
      errors[2] = {
        field: 'Phone Number2',
        status: this.orderForm.controls.phoneNumber2.status,
      };
      errors[3] = {
        field: 'Province',
        status: this.orderForm.controls.province.status,
      };
      errors[4] = {
        field: 'Reiceiver Name',
        status: this.orderForm.controls.receiverName.status,
      };
      errors[5] = {
        field: 'Address',
        status: this.orderForm.controls.streetName.status,
      };
      this.mixpanelService.track(event_name, {
        'Payment Amount': this.total.price + this.shippingCost,
        Status: 'Unsuccessful',
        Errors: errors,
      });
    }
  }

  private setUpNewMixpanel(event_name, status, errorMessage?) {
    let piecesCount = 0;
    this.products.forEach(product => {
      piecesCount = piecesCount + product.quantity;
    });
    let mixpanelObj: any = {
      'User Category': this.user && this.user.loyaltyProgram.loyaltyProgram,
      Language: 'ar',
      'Pieces Count': piecesCount,
      'Is Has Variants': this.products.filter(product => product.attributes && product.attributes.length).length > 0,
      'Total Order Price': this.total.price,
      'Total Profit Amount': this.total.profit,
      'Client Full Name': this.orderForm.value.receiverName,
      'Client Mobile Number': this.orderForm.value.phoneNumber1,
      'Client Alternative Number': this.orderForm.value.phoneNumber2,
      'Client Governate': this.orderForm.value.province,
      'Client Address': this.orderForm.value.streetName,
      'Merchant Facebook Page': this.orderForm.value.orderSource.pageName,
      'Merchant Page Link': this.orderForm.value.orderSource.pageUrl,
      'Merchant Notes': this.orderForm.value.notes,
      'Order Request Status': status ? 'Succeeded' : 'Failed',
    };
    if (!status) {
      mixpanelObj = {
        ...mixpanelObj,
        errorMessage
      };
    }
    this.mixpanelService.track(event_name, mixpanelObj);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    (Object as any)
      .values(formGroup.controls)
      .forEach((control: FormControl) => {
        control.markAsTouched();
        control.markAsDirty();
      });
  }

  private orderNow(): void {
    this.setUpMixpanel('Order_Completion', true);
    const order = this.orderForm.value;
    order.orderProfit = (
      (+order.price - this.product.productPrice + this.product.productProfit) *
      +order.quantity +
      this.offerBonus
    ).toString();
    order.sellerName = this.product.sellerName; // ignore in order cart
    order.phoneNumber = order.phoneNumber.trim();
    order.phoneNumber2 = order.phoneNumber2.trim();
    order.products = [this.product._id];
    order.productQuantities = [+order.quantity];
    order.productPrices = [+order.price * +order.quantity];
    order.pid = this.product.prodID;
    order.productId = this.product._id; // ignore in order cart
    order.sellerId = this.product.seller; // ignore in order cart
    order.cashOnDelivery = this.total.price + this.shippingCost;
    order.offer =
      this.offerBonus > 0
        ? this.offer
        : { name: '', categoryId: '', bonusCases: [] };
    order.offerBonus = this.offerBonus;
    order.province = this.province.value && this.province.value[0]?.location;
    delete order.price;
    delete order.quantity;
    this.user = this.localStorageService.getUser();
    this.orderService
      .orderNow(order)
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
          this.loading = false;
          window.scrollTo(0, 0);
        }))
      .subscribe(
        (res) => {
          this.setUpNewMixpanel('Order_summary_page_place_order_response', true);
          this.submitted.emit({ status: true, orderID: res.order.orderID });
        },
        ({ error }) => {
          this.setUpNewMixpanel('Order_summary_page_place_order_response', false, error.msg);
        }
      );
  }

  private orderCart(): void {
    this.setUpMixpanel('Order_Completion', true);
    const order = this.orderForm.value;
    if (this.orderFromProduct) {
      this.products[0].newPrice = order.price;
      this.products[0].quantity = order.quantity;
      delete order.quantity;
      delete order.price;
    }
    order.products = [];
    order.productQuantities = [];
    order.productPrices = [];
    // order.orderProfit = 0;
    let orderProfit = 0;
    order.productIds = [];
    order.phoneNumber = order.phoneNumber.trim();
    order.phoneNumber2 = order.phoneNumber2.trim();
    this.products.forEach((product) => {
      order.products.push(product.id);
      order.productQuantities.push(product.quantity);
      order.productPrices.push(+product.newPrice * +product.quantity);
      orderProfit +=
        (+product.newPrice - product.productPrice + product.productProfit) *
        +product.quantity;

      order.orderProfit = orderProfit + this.offerBonus;
      order.productIds.push(product.pid);
    });
    order.cashOnDelivery = this.total.price + this.shippingCost;
    order.offer =
      this.offerBonus > 0
        ? this.offer
        : { name: '', categoryId: '', bonusCases: [] };
    order.offerBonus = this.offerBonus;
    order.province = this.province.value && this.province.value[0]?.location;
    this.user = this.localStorageService.getUser();
    this.orderService
      .orderCart(order)
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
          this.loading = false;
          window.scrollTo(0, 0);
        })
      )
      .subscribe(
        (res) => {
          this.submitted.emit({ status: true, orderID: res.order.orderID });
          this.setUpNewMixpanel('Order_summary_page_place_order_response', true);
        },
        ({ error }) => {
          this.setUpNewMixpanel('Order_summary_page_place_order_response', false, error.msg);
          this.submitted.emit({ status: false, orderID: '', errorMessage: error.msg });
        }
      );
  }

}


