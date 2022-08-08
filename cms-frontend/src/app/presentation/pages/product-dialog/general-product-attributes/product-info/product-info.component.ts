import { Component, OnInit } from '@angular/core';
import { AVAILABILITY_STATUSES, PRODUCT_INPUTS } from '@data/constants';
import { ProductsService } from '@presentation/@core/utils/products.service';
@Component({
  selector: 'ngx-product-info',
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.scss'],
})
export class ProductInfoComponent implements OnInit {
  public availabilityStatuses = AVAILABILITY_STATUSES;
  public productsInputs = PRODUCT_INPUTS;
  constructor(
    public productsService: ProductsService,
  ) { }
  ngOnInit(): void {
    const selectedAvailabilityCode = this.productsService.productForm.get('productInfoForm').get('availability').value;
    this.availabilityStatuses = this.availabilityStatuses.map(status => ({
      ...status,
      active: status.code === selectedAvailabilityCode,
    }));
  }
  onProductSpecificationsChange() {
    let specifications = this.productsService.productForm.get('productInfoForm').get('productSpecification').value;
    specifications = specifications
      .replace(/\r/g, '')
      .split(/\n/)
      .map((line) => {
        if (line.charAt(0) !== '•') {
          line = '•' + line;
        }
        if (line.charAt(1) !== ' ') {
          line = '• ' + line.substring(1);
        }
        return line;
      })
      .filter((line, idx, arr) => {
        if (idx !== arr.length - 1 && line.length === 2) {
          return false;
        }
        return true;
      })
      .join('\r\n');
    if (specifications.length === 2) {
      specifications = '';
    }
    this.productsService.productForm.get('productInfoForm').get('productSpecification').setValue(specifications);
  }
}
