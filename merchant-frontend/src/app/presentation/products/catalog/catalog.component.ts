import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Subscription } from 'rxjs';
import { CartService } from 'src/app/presentation/shared/services/cart.service';
import { CatalogService } from 'src/app/presentation/shared/services/catalog.service';
import { COLOR_VARIANTS } from 'src/app/presentation/shared/constants/variants';
import { MultitenancyService } from 'src/app/presentation/shared/services/multitenancy.service';
import { GetPlaceOrdersAvailabilityUseCase } from 'src/app/core/usecases/get-place-orders-availability.usecase';
import { Country } from '../../shared/interfaces/countries';

interface CatalogedProduct {
  Category: string;
  customPrice: number;
  price: number;
  prodID: string;
  productAvailability: string;
  productName: string;
  productPicture: string;
  productPrice: number;
  productProfit: number;
  _id: string;

  productIsSelected: boolean;
  priceEditable: boolean;
  productLink: string;
  productAvailabilityColor: string;
  productAvailabilityText: string;
  merchantSelectedPrice: string;
}

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})

export class CatalogComponent implements OnInit {
  loading = false;
  products: CatalogedProduct[] = [];
  selectAll = false;
  isOrderNow = false;
  selectedProduct: any;
  favChangedSub: Subscription;
  currency: string;
  multitenancyFlag: boolean;
  selectedCountry: Country;


  constructor(
    private cartService: CartService,
    private toastr: ToastrService,
    private catalogService: CatalogService,
    private router: Router,
    private multitenancyService: MultitenancyService,
    public getPlaceOrdersAvailabilityUseCase: GetPlaceOrdersAvailabilityUseCase,
  ) { }

  ngOnInit(): void {
    this.loadProducts();
    this.multitenancyFlag = this.multitenancyService.isMultitenancyEnabled();
    this.currency = this.multitenancyFlag ? this.multitenancyService.getCurrentCountry().currency.arabicName : 'Ø¬Ù†ÙŠÙ‡ Ù…ØµØ±ÙŠ';
    this.selectedCountry = this.multitenancyService.getCurrentCountry();
  }

  loadProducts(): void {
    this.products = [];
    this.loading = true;
    this.catalogService.getCatalogedProducts().subscribe(
      (res) => {
        this.products = res.map(product => {
          const productColorHex = product.attributes.filter(attribute => attribute.type === 'color')[0]?.value;
          let affectedByPriceChangeObj = {};
          if (product.price === product.productPrice) {
            affectedByPriceChangeObj = {
              merchantSelectedPrice: product.customPrice,
              productProfit: product.customPrice > product.price ? product.customPrice - product.productPrice + product.productProfit
                : product.productProfit,
            };
          } else {
            affectedByPriceChangeObj = {
              merchantSelectedPrice: '-',
              productProfit: '-',
            };
          }
          return {
            ...product,
            priceEditable: false,
            productIsSelected: false,
            productLink: this.router.serializeUrl(
              this.router.createUrlTree(['/product-details', product._id],
                { queryParams: { productName: product.productName } })),
            productAvailabilityColor: this.getColor(product.productAvailability),
            productAvailabilityText: this.getProductAvailibilityText(product.productAvailability),
            ...affectedByPriceChangeObj,
            productColorHex,
            productColor: productColorHex && COLOR_VARIANTS.filter(variant => variant.color === productColorHex)[0]?.arabicColorName,
            productSize: product.attributes.filter(attribute => attribute.type === 'size')[0]?.value,

          };
        });

        this.loading = false;
      }, (err) => {
        this.loading = false;
      }
    );
  }

  getColor(productAvailability): string {
    switch (productAvailability) {
      case 'not_available':
        return '#ff4966';
      case 'available_with_low_qty':
        return '#ffae0c';
      case 'available':
      case 'available_with_high_qty':
      default:
        return '#3dbb54';
    }
  }

  getProductAvailibilityText(productAvailability): string {
    switch (productAvailability) {
      case 'not_available':
        return 'ØºÙŠØ± Ù…ØªÙˆÙØ±';
      case 'available_with_low_qty':
        return 'Ù…ØªÙˆÙØ± Ø¨ÙƒÙ…ÙŠØ© Ù…Ø­Ø¯ÙˆØ¯Ø©';
      case 'available':
        return 'Ù…ØªÙˆÙØ±';
      case 'available_with_high_qty':
        return 'Ù…ØªÙˆÙØ± Ø¨ÙƒÙ…ÙŠØ© ÙƒØ¨ÙŠØ±Ø©';
      default:
        return '';
    }
  }

  onToggleSelectAll(): void {
    if (this.selectAll) {
      this.products.forEach((product) => {
        product.productIsSelected = true;
      });
    } else {
      this.products.forEach((product) => {
        product.productIsSelected = false;
      });
    }
  }

  onToggleProductSelection(): void {
    this.selectAll = this.products.every((product) => product.productIsSelected);
  }

  onAddToCart(product): void {
    this.cartService.addToCartWithCustomPrice({ productId: product._id, preferredMerchantPrice: product.customPrice, quantity: 1, overwriteQuantity: false }).subscribe(res => {
      this.toastr.success('ØªÙ… Ø§Ø¶Ø§ÙØ© Ø§Ù„Ù…Ù†ØªØ¬');
    }, err => {
      this.toastr.error('Ø¨Ø±Ø¬Ø§Ø¡ Ø§Ù„Ù…Ø­Ø§ÙˆÙ„Ø© ÙÙ‰ ÙˆÙ‚Øª Ù„Ø§Ø­Ù‚');
    });
  }

  onOrderNow(product): void {
    this.selectedProduct = [{ ...product }];
    this.selectedProduct[0].quantity = 1;
    this.selectedProduct[0].productProfit = product.productProfit;
    this.selectedProduct[0].productPrice = product.customPrice;
    this.selectedProduct[0].id = product._id;
    this.selectedProduct[0].pid = product.prodID;
    this.isOrderNow = true;
  }

  reload(): void {
    this.isOrderNow = false;
    this.loadProducts();
  }

  orderSubmitted(event): void {
    if (event.status) {
      this.toastr.success('ØªÙ… Ø¹Ù…Ù„ Ø§Ù„Ø§ÙˆØ±Ø¯Ø± Ø¨Ù†Ø¬Ø§Ø­');
    } else {
      this.toastr.error('Ø¨Ø±Ø¬Ø§Ø¡ Ø§Ù„Ù…Ø­Ø§ÙˆÙ„Ø© ÙÙ‰ ÙˆÙ‚Øª Ù„Ø§Ø­Ù‚');
    }
    this.reload();
  }

  onEditPrice(product) {
    product.priceEditable = true;
  }

  onConfirmEdit(product) {

    if (product.merchantSelectedPrice < product.productPrice) {
      this.toastr.error('Ø¢Ù‚Ù„ Ø³Ø¹Ø± Ù…Ø³Ù…ÙˆØ­ Ù„Ù„Ù…Ù†ØªØ¬ Ù‡Ùˆ ' + product.productPrice);
      // check new custom price is different than the old one only incase of no price change
    } else if (product.price === product.productPrice && product.merchantSelectedPrice === product.customPrice) {
      this.toastr.error('ÙŠØ¬Ø¨ Ø¥Ø¯Ø®Ø§Ù„ Ø³Ø¹Ø± Ø¬Ø¯ÙŠØ¯');
    } else {
      this.updateFavoriteProductCustomPrice(product);
      product.priceEditable = false;
    }
  }

  updateFavoriteProductCustomPrice(product: CatalogedProduct) {
    this.loading = true;
    if (product.price === product.productPrice) {
      this.catalogService.updateCustomPrice(product._id, product.merchantSelectedPrice).subscribe(
        () => {
          this.reload();
        },
        (err) => {
          this.loading = false;
          this.toastr.error('Ø¨Ø±Ø¬Ø§Ø¡ Ø§Ù„Ù…Ø­Ø§ÙˆÙ„Ø© ÙÙ‰ ÙˆÙ‚Øª Ù„Ø§Ø­Ù‚');
        });
    } else {
      new Promise<void>((resolve, reject) => {
        this.catalogService.uncatalogProduct(product._id).subscribe(() => {
          this.catalogService.catalogProduct(product._id).subscribe(() => {
            this.catalogService.updateCustomPrice(product._id, product.merchantSelectedPrice).subscribe(
              () => {
                this.reload();
              }, err => reject());
          }, err => reject());
        }, err => reject());
      }).then().catch((err) => {
        this.loading = false;
        this.toastr.error('Ø¨Ø±Ø¬Ø§Ø¡ Ø§Ù„Ù…Ø­Ø§ÙˆÙ„Ø© ÙÙ‰ ÙˆÙ‚Øª Ù„Ø§Ø­Ù‚');
      });
    }
  }

  onCancelEdit(product) {
    product.priceEditable = false;
    if (product.price === product.productPrice) {
      product.merchantSelectedPrice = product.customPrice;
    } else {
      product.merchantSelectedPrice = '-';
    }

  }

  onDeleteProduct(product) {
    this.catalogService.uncatalogProduct(product._id).subscribe(
      () => {
        this.reload();
        this.toastr.success('ØªÙ… Ø­Ø°Ù Ø§Ù„Ù…Ù†ØªØ¬ Ù…Ù† Ø§Ù„ÙƒØªØ§Ù„ÙˆØ¬');
      }, (err) => {
        this.toastr.error('Ø¨Ø±Ø¬Ø§Ø¡ Ø§Ù„Ù…Ø­Ø§ÙˆÙ„Ø© ÙÙ‰ ÙˆÙ‚Øª Ù„Ø§Ø­Ù‚');
      }
    );
  }

  onDeleteSelectedProducts() {
    const deletedProductsSubscriptions = this.products.filter(
      (product) => product.productIsSelected).map(
        (product) => this.catalogService.uncatalogProduct(product._id));
    forkJoin(deletedProductsSubscriptions).subscribe(([]) => {
      this.reload();
      if (deletedProductsSubscriptions.length === 1) {
        this.toastr.success('ØªÙ… Ø­Ø°Ù Ø§Ù„Ù…Ù†ØªØ¬ Ù…Ù† Ø§Ù„ÙƒØªØ§Ù„ÙˆØ¬');
      } else {
        this.toastr.success('ØªÙ… Ø­Ø°Ù Ø§Ù„Ù…Ù†ØªØ¬Ø§Øª Ù…Ù† Ø§Ù„ÙƒØªØ§Ù„ÙˆØ¬');
      }
    }, (err) => {
      this.toastr.error('Ø¨Ø±Ø¬Ø§Ø¡ Ø§Ù„Ù…Ø­Ø§ÙˆÙ„Ø© ÙÙ‰ ÙˆÙ‚Øª Ù„Ø§Ø­Ù‚');
    });
  }

}


