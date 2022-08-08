/* eslint-disable @typescript-eslint/naming-convention, no-underscore-dangle */
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { CartService } from 'src/app/presentation/shared/services/cart.service';

import { CatalogService } from 'src/app/presentation/shared/services/catalog.service';
import { Variant, VariantGroup } from 'src/app/presentation/shared/interfaces/variant';
import { LocalStorageService } from 'src/app/presentation/shared/services/local-storage.service';
import { User } from 'src/app/presentation/shared/interfaces/user.interface';
import { MultitenancyService } from 'src/app/presentation/shared/services/multitenancy.service';
import { MixpanelService } from 'src/app/presentation/shared/services/mixpanel.service';

declare let gtag;

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {
  @Input() variantGroup: VariantGroup;
  @Input() product: Variant;
  @Input() tooltipVisible = true;
  public user: User;
  public userLoyaltyProgram: string;
  public productLink;
  public isCataloged = false;
  public hasVariants = false;
  public currency: string;

  constructor(
    private cartService: CartService,
    private mixpanelService: MixpanelService,
    private toastr: ToastrService,
    private router: Router,
    private catalogService: CatalogService,
    private localStorageService: LocalStorageService,
    private multitenancyService: MultitenancyService,
  ) { }

  ngOnInit(): void {
    if (this.variantGroup) {
      this.product = this.variantGroup.primaryVariant;
      this.checkHasVariants();
    }
    this.productLink = this.router.serializeUrl(
      this.router.createUrlTree(['/product-details', this.product._id], { queryParams: {productName: this.product.productName} }));
    this.checkIsCataloged();
    this.user = this.localStorageService.getUser();
    this.currency = this.multitenancyService.getCountryByIsoCode3(this.product.country? this.product.country : 'EGY').currency.arabicName;
  }

  public addToCart(): void {
    this.cartService
      .addToCart(this.product._id, this.product.sellerName, 1)
      .subscribe(
        (res: any) => {
          gtag('event', 'add_to_cart', {
            event_label:
              'prodID: ' +
              this.product.prodID +
              ', phoneNum:' +
              this.user.phoneNum +
              ', TagerID:' +
              this.user.TagerID,
          });
          this.toastr.success('ØªÙ… Ø§Ø¶Ø§ÙØ© Ø§Ù„Ù…Ù†ØªØ¬');
          this.trackMixpanelProductEvent(
            'product_card_add_to_cart_in_section',

          );
        },
        (err) => {
          // console.log(err);
        }
      );
  }

  trackGoToProductMixpanelEvent(): void {
    this.trackMixpanelProductEvent('product_card_click_in_section');
  }
  checkIsCataloged(): void {
    if(this.catalogService.isProductCataloged(this.product._id)) {
      this.isCataloged = true;
    }
  }

  catalogProduct(): void {
    this.catalogService.catalogProduct(this.product._id).subscribe(() => {
      this.isCataloged = true;
      this.toastr.success('ØªÙ… Ø§Ø¶Ø§ÙØ© Ø§Ù„Ù…Ù†ØªØ¬ Ø§Ù„ÙŠ Ø§Ù„ÙƒØªØ§Ù„ÙˆØ¬');
      this.trackMixpanelProductEvent( 'product_card_add_to_catalog_in_section');
    }, () => {
      this.toastr.error('Ø¨Ø±Ø¬Ø§Ø¡ Ø§Ù„Ù…Ø­Ø§ÙˆÙ„Ø© ÙÙ‰ ÙˆÙ‚Øª Ù„Ø§Ø­Ù‚');
    });
  }
  uncatalogProduct(): void {
    this.catalogService.uncatalogProduct(this.product._id).subscribe(() => {
      this.isCataloged = false;
      this.toastr.success('ØªÙ… Ø­Ø°Ù Ø§Ù„Ù…Ù†ØªØ¬ Ù…Ù† Ø§Ù„ÙƒØªØ§Ù„ÙˆØ¬');
      this.trackMixpanelProductEvent( 'product_card_remove_from_catalog_in_section');
    }, () => {
      this.toastr.error('Ø¨Ø±Ø¬Ø§Ø¡ Ø§Ù„Ù…Ø­Ø§ÙˆÙ„Ø© ÙÙ‰ ÙˆÙ‚Øª Ù„Ø§Ø­Ù‚');
    });
  }

  checkHasVariants(): void {
    this.hasVariants = this.variantGroup.variants && this.variantGroup.variants.length > 1;
  }

  private trackMixpanelProductEvent(event_name) {
    this.mixpanelService.track(event_name, {
      'User Category': this.user && this.user.loyaltyProgram.loyaltyProgram,
      'Interface Version': 'v2',
      'Category Id' : this.product.categoryId,
      'Category Name' : this.product.Category,
      'Product Id': this.product.prodID,
      'Product Name': this.product.productName,
      'Product Price': this.product.productPrice,
      'Product Profit': this.product.productProfit,
      'Product Availability Status': this.product.productAvailability,
      'Is Has Variants': this.product.attributes && this.product.attributes.length > 0,
      'Is Added To Catalog': this.isCataloged
    });
  }

}


