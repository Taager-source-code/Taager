import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { ProvinceService } from 'src/app/presentation/shared/services/province.service';
import { ProductService } from 'src/app/presentation/shared/services/product.service';
import { SuccessOrderModalComponent } from './success-order-modal/success-order-modal.component';
import { ConfirmDeleteItemComponent } from './confirm-delete-item/confirm-delete-item.component';
import { Variant } from 'src/app/presentation/shared/interfaces/variant';
import { COLOR_VARIANTS } from 'src/app/presentation/shared/constants/variants';
import * as XLSX from 'xlsx';
import { LocalStorageService } from 'src/app/presentation/shared/services/local-storage.service';
import { BULK_ORDERS_FEATURE, FEATURE_FLAGS } from 'src/app/presentation/shared/constants';
import { User } from 'src/app/presentation/shared/interfaces/user.interface';
import { MultitenancyService } from 'src/app/presentation/shared/services/multitenancy.service';
import { Country } from 'src/app/presentation/shared/interfaces/countries';
import { CartService } from 'src/app/presentation/shared/services/cart.service';
import { MixpanelService } from 'src/app/presentation/shared/services/mixpanel.service';
import { UtilityService } from 'src/app/presentation/shared/services/utility.service';
import { GetFeatureFlagUsecase } from 'src/app/core/usecases/get-feature-flag.usecase';
import { GetPlaceOrdersAvailabilityUseCase } from 'src/app/core/usecases/get-place-orders-availability.usecase';

interface CartVariant extends Variant {
  selected: boolean;
  quantity: number;
  pid: string;
  newPrice: number;
  qty: number;
  sellerName: string;
  id: string;
  productColor: string;
  productColorHex: string;
  productSize: string;
  isAvailableToSeller: boolean;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  public products: CartVariant[] = [];
  public selectedProducts = [];
  public pageLoading = false;
  public totalSelectedQuatity = 0;
  public order = false;
  public total: {
    price: number;
    profit: number;
    count: number;
  } = { price: 0, profit: 0, count: 0 };
  public checked = false;
  public bulkOrderFeature = false;
  public bulkOrders = false;
  public importedOrders = [];
  public user: User;
  public errorMessages = [];
  public selectedCountry: Country;
  public currency: string;
  public arrowActivePath = 'assets/img/cart-icons/Vector.svg';
  public arrowNotActivePath = 'assets/img/cart-icons/Vector-not-active.svg';
  public cartIcon = 'assets/img/cart-icons/shopping-cart.svg';
  public doneIcon = 'assets/img/cart-icons/Done.svg';
  cartStepperFlag: boolean;

  /**
   * flag service for service availability
   */
  // public serviceIsAvailableInLocale: boolean;

  constructor(
    private cartService: CartService,
    private mixpanelService: MixpanelService,
    private provinceService: ProvinceService,
    private productService: ProductService,
    private utilityService: UtilityService,
    private toast: ToastrService,
    public dialog: MatDialog,
    private router: Router,
    private localStorageService: LocalStorageService,
    private multitenancyService: MultitenancyService,
    private getFeatureFlagUseCase: GetFeatureFlagUsecase,
    public getPlaceOrderAvailabilityUseCase: GetPlaceOrdersAvailabilityUseCase
  ) { }

  ngOnInit(): void {
    this.pageLoading = true;
    const isMultitenancyEnabled = this.multitenancyService.isMultitenancyEnabled();
    this.currency = isMultitenancyEnabled ? this.multitenancyService.getCurrentCountry().currency.arabicName : 'Ø¬Ù†ÙŠÙ‡ Ù…ØµØ±ÙŠ';
    this.cartService
      .getCartData()
      .pipe(
        finalize(() => {
          this.pageLoading = false;
        })
      )
      .subscribe(
        (res: any) => {
          this.products = res.data;
          this.products = this.products.map((product) => {
            const productColorHex = product.attributes.filter(attribute => attribute.type === 'color')[0]?.value;
            return {
              ...product,
              quantity: product.qty,
              newPrice: product.productPrice,
              selected: false,
              productColorHex,
              productColor: productColorHex && COLOR_VARIANTS.filter(variant => variant.color === productColorHex)[0].arabicColorName,
              productSize: product.attributes.filter(attribute => attribute.type === 'size')[0]?.value,
            };
          });

          this.showBulkOrder();
        },
        (err) => {
          this.toast.error('Ø¨Ø±Ø¬Ø§Ø¡ Ø§Ù„Ù…Ø­Ø§ÙˆÙ„Ø© ÙÙ‰ ÙˆÙ‚Øª Ù„Ø§Ø­Ù‚');
        }
      );
    this.selectedCountry = this.multitenancyService.getCurrentCountry();
    this.getFeatureFlagUseCase.execute(FEATURE_FLAGS.CART_STEPPER_FLAG).subscribe((flag) => {
      this.cartStepperFlag = flag;
    });
  }

  showBulkOrder(): void {
    this.user = this.localStorageService.getUser();
    this.bulkOrderFeature = this.user?.features?.includes(BULK_ORDERS_FEATURE);
  }
  trackMixpanelEvent(eventName) {
    const cartItems = [];
    let i = 0;
    this.products.forEach((item) => {
      if (item.selected) {
        cartItems[i] = item.pid;
        i++;
      }
    });
    this.mixpanelService.track(eventName, {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Number of Products': this.products.length,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Total Products': this.total.count,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Total Price': this.total.price,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Total Profit': this.total.profit,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Product Ids': cartItems,
    });
  }


  removeFromCart(productId, sellerName): void {
    this.cartService
      .removeFromCart(productId, sellerName)
      .pipe(finalize(() => { }))
      .subscribe(
        () => {
          this.products = this.products.filter((item) => item.id !== productId);
          this.countTotal();
          this.toast.success('ØªÙ… Ø­Ø°Ù Ø§Ù„Ù…Ù†ØªØ¬');
        },
        () => {
          this.toast.error('Ø¨Ø±Ø¬Ø§Ø¡ Ø§Ù„Ù…Ø­Ø§ÙˆÙ„Ø© ÙÙ‰ ÙˆÙ‚Øª Ù„Ø§Ø­Ù‚');
        }
      );
  }

  deleteSelected(): void {
    const selectedProducts = this.products.filter((item) => item.selected);
    if (selectedProducts.length > 0) {
      const dialogRef = this.dialog.open(ConfirmDeleteItemComponent, {
        width: '350px',
      });

      dialogRef.afterClosed().subscribe((res) => {
        if (res) {
          const removeArray = selectedProducts;
          removeArray.forEach((item) =>
            this.removeFromCart(item.id, item.sellerName)
          );
        }
      });
    }
  }

  checkout(): void {
    this.order = this.isValuesValid();
    this.trackMixpanelEvent('Cart_Checkout');
    window.scrollTo(0, 0);
  }

  onBlurQuantityInput(product): void {
    product.quantity = Math.abs(product.quantity);
    if (product.quantity === 0) {
      product.quantity = 1;
    }
    this.cartService.addToCart(product.id, product.sellerName, product.quantity, true)
      .subscribe(() => {
        this.countTotal();
      });
  }

  isValuesValid(): boolean {
    this.totalSelectedQuatity = 0;
    if (this.products && this.products.length) {
      this.products.forEach((item) => {
        if (item.selected) {
          this.totalSelectedQuatity = this.totalSelectedQuatity + item.quantity;
        }
      });
    }
    for (const element of this.products) {
      const profit = this.profitByProducts(
        element.productProfit,
        element.productPrice,
        element.newPrice,
        element.quantity
      );
      if (
        element.newPrice < element.productPrice &&
        this.totalSelectedQuatity < 10
      ) {
        this.order = false;
        return false;
      } else if (
        element.productPrice - element.newPrice > profit &&
        this.totalSelectedQuatity >= 10
      ) {
        this.order = false;
        return false;
      }
    }
    return true;
  }

  public enableZeroProfit() {
    if (this.products && this.products.length) {
      this.products.forEach((element, index) => {
        if (element.selected && this.totalSelectedQuatity >= 10) {
          const profit = this.profitByProducts(
            element.productProfit,
            element.productPrice,
            element.newPrice,
            element.quantity
          );
          if (element.newPrice > element.productPrice) {
            this.products[index].newPrice = element.newPrice - profit;
          } else {
            this.products[index].newPrice = element.productPrice - profit;
          }
        }
      });
      this.countTotal();
    }
  }

  orderSubmitted(e): void {
    if (e.status) {
      window.scrollTo(0, 0);
      this.products = this.products.filter((item) => !item.selected);
      this.order = false;
      // this.toast.success('ØªÙ… Ø¹Ù…Ù„ Ø§Ù„Ø§ÙˆØ±Ø¯Ø± Ø¨Ù†Ø¬Ø§Ø­');
      this.openSuccessDialog(e.orderID);
    } else if (e.errorMessage === 'One or more products is not available') {
      this.toast.error('Ø¹Ø°Ø±Ù‹Ø§ØŒ Ù‡Ø°Ø§ Ø§Ù„Ù…Ù†ØªØ¬ ØºÙŠØ± Ù…ØªÙˆÙØ± Ø­Ø§Ù„ÙŠÙ‹Ø§');
    } else if (e.errorMessage?.includes('spam behavior') ) {
      this.toast.error('Ø¹Ø²ÙŠØ²ÙŠ Ø§Ù„ØªØ§Ø¬Ø± Ù„Ø§ÙŠÙ…ÙƒÙ† Ø¥Ø³ØªÙ„Ø§Ù… Ø§Ù„Ø·Ù„Ø¨ Ù„Ø£Ù† Ù‡Ø°Ø§ Ø§Ù„Ø¹Ù…ÙŠÙ„ Ù„Ù‡ ØªØ§Ø±ÙŠØ® Ù…Ù† Ø¥Ø³Ø§Ø¡Ø© Ø¥Ø³ØªØ®Ø¯Ø§Ù… Ø§Ù„Ù†Ø¸Ø§Ù… Ùˆ Ø¹Ø¯Ù… Ø¥Ø³ØªÙ„Ø§Ù… Ø§Ù„Ø·Ù„Ø¨Ø§Øª');
    } else {
      this.toast.error('Ù‡Ù†Ø§Ùƒ Ù…Ø´ÙƒÙ„Ø© ÙÙŠ Ø§Ù„Ø³ÙŠØ±ÙØ±ØŒ Ø¨Ø±Ø¬Ø§Ø¡ Ø§Ù„Ù…Ø­Ø§ÙˆÙ„Ø© ÙÙŠ ÙˆÙ‚Øª Ù„Ø§Ø­Ù‚');
    }

  }

  openSuccessDialog(orderID): void {
    const dialogRef = this.dialog.open(SuccessOrderModalComponent, {
      width: '350px',
      data: orderID
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.router.navigate(['/products-v2']);
      }
    });
  }

  openDeleteConfirmDialog(productId, sellerName): void {
    const dialogRef = this.dialog.open(ConfirmDeleteItemComponent, {
      width: '460px',
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.removeFromCart(productId, sellerName);
      }
    });
  }

  checkUncheckAll(): void {
    this.products.filter(item => item.isAvailableToSeller).forEach((item) => {
      item.selected = this.checked;
    });
    this.countTotal();
  }

  isAllSelected(): void {
    this.checked = this.products.filter(item => item.isAvailableToSeller).every((item) => item.selected);
    this.countTotal();
  }

  profitByProducts(profit: number, price: number, newPrice: number, quantity: number): number {
    if (newPrice < price) {
      return profit;
    }
    return (newPrice - price + profit) * quantity;
  }
  increment(product): void {
    product.quantity++;
    this.cartService.addToCart(product.id, product.sellerName, product.quantity, true).subscribe(() => {
      this.countTotal();
    });
  }
  decrement(product): void {
    if (product.quantity > 1) {
      product.quantity--;
      this.cartService.addToCart(product.id, product.sellerName, product.quantity, true).subscribe(() => {
        this.countTotal();
      });
    }
  }
  countTotal(): void {
    this.selectedProducts = this.products.filter((item) => item.selected);
    this.totalSelectedQuatity = 0;
    if (this.products && this.products.length) {
      this.products.forEach((item) => {
        if (item.quantity === 0) {
          item.quantity = 1;
        }
        if (item.selected) {
          this.totalSelectedQuatity = this.totalSelectedQuatity + item.quantity;
        }
      });
    }
    this.total = this.selectedProducts.reduce(
      (acc, item) => {
        acc.price += item.newPrice * item.quantity;
        if (item.newPrice < item.productPrice) {
          const remainProfit =
            item.productProfit - (item.productPrice - item.newPrice);
          if (remainProfit >= 0) {
            acc.profit += remainProfit * item.quantity;
          }
        } else {
          acc.profit +=
            (item.productProfit + item.newPrice - item.productPrice) *
            item.quantity;
        }
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

  downloadTemplate() {
    //this.bulkOrders = true;
    //window.scrollTo(0, 0);

    if (!this.products || !this.products.length) {
      return;
    }

    this.provinceService.getProvinces().subscribe(res => {
      const provinces = res.data;
      this.utilityService.exportCartToExcel(this.products, 'bulk_orders', provinces, this.selectedCountry.arabicName);
    });
  }

  onSendFile(event) {
    this.errorMessages = [];

    const {
      target: { name, files },
    } = event;
    const file = files[0];

    const fr = new FileReader();

    fr.readAsText(file);

    const globalThis = this;

    fr.onload = (e) => {
      const content = e.target.result.toString();

      const lines = content.split('\n');
      const result = [];
      const headers = lines[0].split(',');

      const orders = [];
      const errors = [];

      //file format validation
      if (headers.length < 12) {
        errors.push({
          row: 'Ø§Ù„ÙƒÙ„',
          error: 'ØªÙ†Ø³ÙŠÙ‚ Ù…Ù„Ù ØºÙŠØ± ØµØ§Ù„Ø­ (Ø£Ø¹Ù…Ø¯Ø© Ù…ÙÙ‚ÙˆØ¯Ø©)',
        });
      } else {
        //required fields validation
        for (let indx = 1; indx < lines.length; indx++) {
          const element = lines[indx];
          const values = element.split(',');
          for (let index = 0; index < values.length - 2; index++) {
            const innerElement = values[index];
            if (innerElement === '' && indx !== 12 && indx !== 13) {
              errors.push({
                row: indx,
                label: 'Ù…Ø·Ù„ÙˆØ¨',
                error: headers[index],
              });
            }
          }
        }
      }

      const productIdsList = [];
      let dbProds = [];

      if (errors.length === 0) {
        for (let indx = 1; indx < lines.length; indx++) {
          const element = lines[indx];
          const values = element.split(',');
          productIdsList.push(values[0]);
        }

        this.productService.getProductsByProdIds(productIdsList).subscribe(
          (res: any) => {
            dbProds = res.data;

            for (let index = 1; index < lines.length; index++) {
              const element = lines[index];
              const values = element.split(',');

              //product id exists validation
              if (
                !dbProds.find(
                  (x) => x.prodID.toString() === values[0].toString()
                )
              ) {
                errors.push({
                  row: index,
                  error: `ÙƒÙˆØ¯ Ø§Ù„Ù…Ù†ØªØ¬ "${values[0]}" ØºÙŠØ± ØµØ­ÙŠØ­`,
                });
              }

              if (!parseInt(values[2], 10)) {
                errors.push({
                  row: index,
                  error: `Ø³Ø¹Ø± Ø§Ù„Ù…Ù†ØªØ¬ "${values[2]}" ØºÙŠØ± ØµØ­ÙŠØ­`,
                });
              }

              if (!parseInt(values[3], 10)) {
                errors.push({
                  row: index,
                  error: `ÙƒÙ…ÙŠØ© Ø§Ù„Ù…Ù†ØªØ¬ "${values[3]}" ØºÙŠØ± ØµØ­ÙŠØ­`,
                });
              }
            }

            if (errors.length === 0) {
              let i = 1;

              for (let index = 1; index < lines.length; index++) {
                const element = lines[index];

                const values = element.split(',');

                const orderObject = {
                  id: 0,
                  productId: values[0],
                  productName: values[1],
                  productNewPrice: values[2],
                  productQty: values[3],
                  receiverName: values[4],
                  province: values[5],
                  streetName: values[6],
                  phoneNumber: values[7].replace('\'', ''),
                  phoneNumber2: values[8],
                  notes: values[9],
                  orderSource: {
                    pageName: values[10],
                    pageUrl: values[11],
                  },
                  productOriginalPrice: dbProds.find(
                    (x) => x.prodID.toString() === values[0].toString()
                  ).productPrice,
                  productProfit: dbProds.find(
                    (x) => x.prodID.toString() === values[0].toString()
                  ).productProfit,
                  // eslint-disable-next-line no-underscore-dangle
                  productObjectId: dbProds.find(
                    (x) => x.prodID.toString() === values[0].toString()
                  )._id,
                  categoryId: dbProds.find(
                    (x) => x.prodID.toString() === values[0].toString()
                  ).categoryId,
                };

                productIdsList.push(values[0]);

                const order = orders.find(
                  (x) =>
                    x.phoneNumber.toString() ===
                    orderObject.phoneNumber.toString()
                );

                if (order) {
                  if (
                    order.productId.toString() ===
                    orderObject.productId.toString()
                  ) {
                    order.productQty =
                      parseInt(order.productQty, 10) +
                      parseInt(orderObject.productQty, 10);
                  } else {
                    orderObject.id = order.id;
                    orders.push(orderObject);
                  }
                } else {
                  orderObject.id = i;
                  orders.push(orderObject);
                  i++;
                }
              }

              this.provinceService
                .getAllProvinces(1000, 1)
                .subscribe((provincesResponse: any) => {
                  const provinces = provincesResponse.data;
                  for (let index = 0; index < orders.length; index++) {
                    const element = orders[index];
                    if (
                      !provinces.find(
                        (x) =>
                          x.location.toString() === element.province.toString()
                      )
                    ) {
                      errors.push({
                        row: index,
                        error: ` Ø§Ø³Ù… Ø§Ù„Ù…Ø­Ø§ÙØ¸Ø© "${element.province}" ØºÙŠØ± ØµØ­ÙŠØ­`,
                      });
                    }
                  }
                });

              //phone number validation

              for (let index = 0; index < orders.length; index++) {
                const element = orders[index];

                if (!element.phoneNumber.startsWith('+20-')) {
                  errors.push({
                    row: index,
                    //`Ø±Ù‚Ù… Ø§Ù„Ù‡Ø§ØªÙ  ${element.phoneNumber} `  ÙŠØ¬Ø¨ Ø£Ù† ØªØ¨Ø¯Ø£ Ø¨  +20- (Ù…Ø«Ø§Ù„ +20-10, +20-11, +20-12, +20-15)`
                    error:
                      `Ø±Ù‚Ù… Ø§Ù„Ù‡Ø§ØªÙ "${element.phoneNumber}" ØºÙŠØ± ØµØ­ÙŠØ­ ` +
                      '(ÙŠØ¬Ø¨ Ø£Ù† ØªØ¨Ø¯Ø£ Ø¨  "+20-")',
                  });
                } else {
                  const number1 = element.phoneNumber.substring(4);

                  if (!(parseInt(number1, 10) && number1.length === 10)) {
                    errors.push({
                      row: index,
                      error:
                        `Ø±Ù‚Ù… Ø§Ù„Ù‡Ø§ØªÙ "${element.phoneNumber}" ØºÙŠØ± ØµØ­ÙŠØ­` +
                        '(ÙŠØ¬Ø¨ Ø£Ù† ØªØªÙƒÙˆÙ† Ù…Ù† 10 Ø£Ø±Ù‚Ø§Ù… ÙÙ‚Ø· Ø¨Ø¹Ø¯ "+ 20-")',
                      //`phone number 1  ${element.phoneNumber} ØºÙŠØ± ØµØ­ÙŠØ­ (should be only 10 numbers after "+20-")`
                    });
                  } else {
                    element.phoneNumber = element.phoneNumber.replace(
                      '+20-',
                      '0'
                    );
                  }
                }
                if (element.phoneNumber2.length > 4) {
                  if (!element.phoneNumber2.startsWith('+20-')) {
                    errors.push({
                      row: index,
                      error:
                        `Ø±Ù‚Ù… Ø§Ù„Ù‡Ø§ØªÙ "${element.phoneNumber2}" ØºÙŠØ± ØµØ­ÙŠØ­ ` +
                        '(ÙŠØ¬Ø¨ Ø£Ù† ØªØ¨Ø¯Ø£ Ø¨  "+20-")',
                    });
                  } else {
                    const number2 = element.phoneNumber2.substring(4);

                    if (!(parseInt(number2, 10) && number2.length === 10)) {
                      errors.push({
                        row: index,
                        error:
                          `Ø±Ù‚Ù… Ø§Ù„Ù‡Ø§ØªÙ "${element.phoneNumber}" ØºÙŠØ± ØµØ­ÙŠØ­` +
                          '(ÙŠØ¬Ø¨ Ø£Ù† ØªØªÙƒÙˆÙ† Ù…Ù† 10 Ø£Ø±Ù‚Ø§Ù… ÙÙ‚Ø· Ø¨Ø¹Ø¯ "+ 20-")',
                      });
                    } else {
                      element.phoneNumber2 = element.phoneNumber2.replace(
                        '+20-',
                        '0'
                      );
                    }
                  }
                }
              }

              for (let index = 0; index < orders.length; index++) {
                const element = orders[index];

                //product price validation
                if (
                  element.productNewPrice < element.productOriginalPrice &&
                  element.productQty < 10
                ) {
                  errors.push({
                    row: index,
                    error: `Ø³Ø¹Ø± Ø§Ù„Ù…Ù†ØªØ¬ "${element.productId} - ${element.productName}"
                    Ù„Ø§ ÙŠÙ…ÙƒÙ† Ø£Ù† ÙŠÙƒÙˆÙ† Ø£Ù‚Ù„ Ù…Ù†  "${element.productOriginalPrice}"
                    Ù…Ø§ Ù„Ù… ØªÙƒÙ† ÙƒÙ…ÙŠØªÙ‡ Ø£ÙƒØ«Ø± Ù…Ù† 10`,
                  });
                }

                //product availability validation
                const p = dbProds.find(
                  (x) => x.prodID.toString() === element.productId.toString()
                );

                if (p.showProductAvailability) {
                  if (p.productAvailability === 'not_available') {
                    errors.push({
                      row: index,
                      error: ` Ø§Ù„Ù…Ù†ØªØ¬"${element.productId} - ${element.productName}" ØºÙŠØ± Ù…ØªÙˆÙØ±`,
                    });
                  }
                } else {
                  if (p.productQuantityStatus === 'not_available') {
                    errors.push({
                      row: index,
                      error: ` Ø§Ù„Ù…Ù†ØªØ¬"${element.productId} - ${element.productName}" ØºÙŠØ± Ù…ØªÙˆÙØ±`,
                    });
                  }
                }
              }
            }

            if (errors.length === 0) {
              //send orders to bulk order componenet
              this.importedOrders = orders;

              this.bulkOrders = true;
              window.scrollTo(0, 0);
            } else {
              this.errorMessages = errors; //JSON.stringify(errors, null, 2);
              //set errors to label in ui
            }
          },
          (err) => {
            this.errorMessages.push({
              row: 'Ø§Ù„ÙƒÙ„',
              error: 'Ù„Ø§ ÙŠÙ…ÙƒÙ† Ø§Ù„ØªØ­Ù‚Ù‚ Ù…Ù† ØµØ­Ø© Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª Ø¨Ø³Ø¨Ø¨ Ø®Ø·Ø£ ÙÙ†ÙŠ',
            });
          }
        );
      } else {
        this.errorMessages = errors;
      }
    };
  }

  onSendXLSXFile(event: any) {
    this.errorMessages = [];

    const target: DataTransfer = event.target as DataTransfer;
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);

    reader.onload = (e: any) => {

      const lines = [];
      const headers = [];
      const orders = [];
      const errors = [];

      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      let row;
      let rowNum;
      let colNum;
      const range = XLSX.utils.decode_range(ws['!ref']);
      for (rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
        row = [];
        for (colNum = range.s.c; colNum <= range.e.c + 1; colNum++) {
          const nextCell = ws[XLSX.utils.encode_cell({ r: rowNum, c: colNum })];
          if (typeof nextCell === 'undefined') {
            // row.push(void 0);
          } else {
            row.push(nextCell.w);
          }
        }
        lines.push(row.join(','));
      }

      const columnCount = XLSX.utils.decode_range(ws['!ref']).e.c + 1;
      for (let i = 0; i < columnCount; ++i) {
        headers[i] = ws[`${XLSX.utils.encode_col(i)}1`].v;
      }

      if (headers.length < 12) {
        errors.push({
          row: 'Ø§Ù„ÙƒÙ„',
          error: 'ØªÙ†Ø³ÙŠÙ‚ Ù…Ù„Ù ØºÙŠØ± ØµØ§Ù„Ø­ (Ø£Ø¹Ù…Ø¯Ø© Ù…ÙÙ‚ÙˆØ¯Ø©)',
        });
      } else {
        //required fields validation
        for (let indx = 1; indx < lines.length; indx++) {
          const element = lines[indx];
          const values = element.split(',');
          for (let index = 0; index < values.length - 2; index++) {
            const innerElement = values[index];
            if (innerElement === '') {
              errors.push({
                row: indx,
                label: 'Ù…Ø·Ù„ÙˆØ¨',
                error: headers[index],
              });
            }
          }
        }
      }

      const productIdsList = [];
      let dbProds = [];

      if (errors.length === 0) {
        for (let indx = 1; indx < lines.length; indx++) {
          const element = lines[indx];
          const values = element.split(',');
          productIdsList.push(values[0]);
        }

        this.productService.getProductsByProdIds(productIdsList).subscribe(
          (res: any) => {
            dbProds = res.data;
            const filledLines = lines.filter(item => item);

            for (let index = 1; index < filledLines.length; index++) {
              const element = filledLines[index];
              const values = element.split(',');

              //product id exists validation
              if (
                !dbProds.find(
                  (x) => x.prodID.toString() === values[0].toString()
                )
              ) {
                errors.push({
                  row: index,
                  error: `ÙƒÙˆØ¯ Ø§Ù„Ù…Ù†ØªØ¬ "${values[0]}" ØºÙŠØ± ØµØ­ÙŠØ­`,
                });
              }

              if (!parseInt(values[2], 10)) {
                errors.push({
                  row: index,
                  error: `Ø³Ø¹Ø± Ø§Ù„Ù…Ù†ØªØ¬ "${values[2]}" ØºÙŠØ± ØµØ­ÙŠØ­`,
                });
              }

              if (!parseInt(values[3], 10)) {
                errors.push({
                  row: index,
                  error: `ÙƒÙ…ÙŠØ© Ø§Ù„Ù…Ù†ØªØ¬ "${values[3]}" ØºÙŠØ± ØµØ­ÙŠØ­`,
                });
              }
            }

            if (errors.length === 0) {
              let i = 1;

              for (let index = 1; index < filledLines.length; index++) {
                const element = filledLines[index];
                const values = element.split(',');

                const orderObject = {
                  id: 0,
                  productId: values[0],
                  productName: values[1],
                  productNewPrice: values[2],
                  productQty: values[3],
                  receiverName: values[4],
                  province: values[5],
                  streetName: values[6],
                  phoneNumber: values[7],
                  phoneNumber2: values[8],
                  notes: values[9],
                  orderSource: {
                    pageName: values[10],
                    pageUrl: values[11],
                  },
                  country: this.multitenancyService.getCurrentCountry().isoCode3,
                  productOriginalPrice: dbProds.find(
                    (x) => x.prodID.toString() === values[0].toString()
                  ).productPrice,
                  productProfit: dbProds.find(
                    (x) => x.prodID.toString() === values[0].toString()
                  ).productProfit,
                  // eslint-disable-next-line no-underscore-dangle
                  productObjectId: dbProds.find(
                    (x) => x.prodID.toString() === values[0].toString()
                  )._id,
                  categoryId: dbProds.find(
                    (x) => x.prodID.toString() === values[0].toString()
                  ).categoryId,
                };

                productIdsList.push(values[0]);

                const order = orders.find(
                  (x) =>
                    x.phoneNumber.toString() ===
                    orderObject.phoneNumber.toString()
                );

                if (order) {
                  if (
                    order.productId.toString() ===
                    orderObject.productId.toString()
                  ) {
                    order.productQty =
                      parseInt(order.productQty, 10) +
                      parseInt(orderObject.productQty, 10);
                  } else {
                    orderObject.id = order.id;
                    orders.push(orderObject);
                  }
                } else {
                  orderObject.id = i;
                  orders.push(orderObject);
                  i++;
                }
              }

              this.provinceService
                .getProvinces()
                .subscribe((provincesResponse: any) => {
                  const provinces = provincesResponse.data;
                  for (let index = 0; index < orders.length; index++) {
                    const element = orders[index];
                    if (
                      !provinces.find(
                        (x) =>
                          x.location.toString() === element.province.toString()
                      )
                    ) {
                      errors.push({
                        row: index,
                        error: ` Ø§Ø³Ù… Ø§Ù„Ù…Ø­Ø§ÙØ¸Ø© "${element.province}" ØºÙŠØ± ØµØ­ÙŠØ­`,
                      });
                    }
                  }
                });

              //phone number validation
              if (this.selectedCountry.isoCode3.toUpperCase() === 'EGY') {
                for (let index = 0; index < orders.length; index++) {
                  const element = orders[index];

                  if (!element.phoneNumber.startsWith('1')) {
                    errors.push({
                      row: index,
                      error:
                        `Ø±Ù‚Ù… Ø§Ù„Ù‡Ø§ØªÙ "${element.phoneNumber}" ØºÙŠØ± ØµØ­ÙŠØ­ ` +
                        '(ÙŠØ¬Ø¨ Ø£Ù† ØªØ¨Ø¯Ø£ Ø¨  "1")',
                    });
                  } else {
                    const number1 = element.phoneNumber;
                    if (!(parseInt(number1, 10) && number1.length === 10)) {
                      errors.push({
                        row: index,
                        error:
                          `Ø±Ù‚Ù… Ø§Ù„Ù‡Ø§ØªÙ "${element.phoneNumber}" ØºÙŠØ± ØµØ­ÙŠØ­` +
                          '(ÙŠØ¬Ø¨ Ø£Ù† ØªØªÙƒÙˆÙ† Ù…Ù† 10 Ø£Ø±Ù‚Ø§Ù…)',
                      });
                    } else {
                      if (
                        element.phoneNumber.length === 10 &&
                        element.phoneNumber.startsWith('1') &&
                        !(element.phoneNumber.startsWith('0'))
                      ) {
                        element.phoneNumber = '0' + element.phoneNumber;
                      }
                    }
                  }

                  if (element.phoneNumber2.length >= 2) {
                    if (!element.phoneNumber2.startsWith('1')) {
                      const number2 = element.phoneNumber2;
                      if (!(parseInt(number2, 10) && number2.length === 9)) {
                        errors.push({
                          row: index,
                          error:
                            `Ø±Ù‚Ù… Ø§Ù„Ù‡Ø§ØªÙ 2 "${element.phoneNumber2}" ØºÙŠØ± ØµØ­ÙŠØ­ ` +
                            '(ÙŠØ¬Ø¨ Ø£Ù† ØªØªÙƒÙˆÙ† Ù…Ù† 9 Ø£Ø±Ù‚Ø§Ù… ÙÙ‚Ø· )',
                        });
                      } else {
                        element.phoneNumber2 = '0' + element.phoneNumber2;
                      }
                    } else {
                      const number2 = element.phoneNumber2;

                      if (!(parseInt(number2, 10) && number2.length === 10)) {
                        errors.push({
                          row: index,
                          error:
                            `Ø±Ù‚Ù… Ø§Ù„Ù‡Ø§ØªÙ 2 "${element.phoneNumber2}" ØºÙŠØ± ØµØ­ÙŠØ­` +
                            '(ÙŠØ¬Ø¨ Ø£Ù† ØªØªÙƒÙˆÙ† Ù…Ù† 10 Ø£Ø±Ù‚Ø§Ù… ÙÙ‚Ø· )',
                        });
                      } else {
                        element.phoneNumber2 = '0' + element.phoneNumber2;
                      }
                    }
                  } else {
                    if (element.phoneNumber2.length === 1) {
                      element.phoneNumber2 = '';
                    }
                  }
                }
              } else {
                for (const [index, order] of orders.entries()) {
                  if (/\s/.test(order.phoneNumber)) {
                    errors.push({
                      row: index,
                      error:
                        `Ø±Ù‚Ù… Ø§Ù„Ù‡Ø§ØªÙ "${order.phoneNumber}" ØºÙŠØ± ØµØ­ÙŠØ­` +
                        '(ÙŠØ¬Ø¨ Ø§Ù„Ø§ ÙŠØ­ØªÙˆÙ‰ Ø±Ù‚Ù… Ø§Ù„Ù…ÙˆØ¨Ø§ÙŠÙ„ Ø¹Ù„Ù‰ Ø§ÙŠ Ù…Ø³Ø§ÙØ§Øª)',
                    });
                  };
                  if (/\s/.test(order.phoneNumber2)) {
                    errors.push({
                      row: index,
                      error:
                        `Ø±Ù‚Ù… Ø§Ù„Ù‡Ø§ØªÙ 2 "${order.phoneNumber2}" ØºÙŠØ± ØµØ­ÙŠØ­` +
                        '(ÙŠØ¬Ø¨ Ø§Ù„Ø§ ÙŠØ­ØªÙˆÙ‰ Ø±Ù‚Ù… Ø§Ù„Ù…ÙˆØ¨Ø§ÙŠÙ„ Ø¹Ù„Ù‰ Ø§ÙŠ Ù…Ø³Ø§ÙØ§Øª)',
                    });
                  };
                }
              }

              for (let index = 0; index < orders.length; index++) {
                const element = orders[index];

                //product price validation
                if (
                  element.productNewPrice < element.productOriginalPrice &&
                  element.productQty < 10
                ) {
                  errors.push({
                    row: index,
                    error: `Ø³Ø¹Ø± Ø§Ù„Ù…Ù†ØªØ¬ "${element.productId} - ${element.productName}"
                    Ù„Ø§ ÙŠÙ…ÙƒÙ† Ø£Ù† ÙŠÙƒÙˆÙ† Ø£Ù‚Ù„ Ù…Ù†  "${element.productOriginalPrice}" Ù…Ø§ Ù„Ù… ØªÙƒÙ† ÙƒÙ…ÙŠØªÙ‡ Ø£ÙƒØ«Ø± Ù…Ù† 10`,
                  });
                }

                //product availability validation
                const p = dbProds.find(
                  (x) => x.prodID.toString() === element.productId.toString()
                );

                if (p.productAvailability === 'not_available') {
                  errors.push({
                    row: index,
                    error: ` Ø§Ù„Ù…Ù†ØªØ¬"${element.productId} - ${element.productName}" ØºÙŠØ± Ù…ØªÙˆÙØ±`,
                  });
                }
              }
            }

            if (errors.length === 0) {
              //send orders to bulk order componenet

              this.importedOrders = orders;

              this.bulkOrders = true;
              window.scrollTo(0, 0);
            } else {
              this.errorMessages = errors;
            }
          },
          (err) => {
            this.errorMessages.push({
              row: 'Ø§Ù„ÙƒÙ„',
              error: 'Ù„Ø§ ÙŠÙ…ÙƒÙ† Ø§Ù„ØªØ­Ù‚Ù‚ Ù…Ù† ØµØ­Ø© Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª Ø¨Ø³Ø¨Ø¨ Ø®Ø·Ø£ ÙÙ†ÙŠ',
            });
          }
        );
      } else {
        this.errorMessages = errors;
      }
    };
  }
}


