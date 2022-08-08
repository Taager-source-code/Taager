import { Component, OnInit } from '@angular/core';
import { ProductsService } from '@presentation/@core/utils/products.service';
@Component({
  selector: 'ngx-general-product-attributes',
  templateUrl: './general-product-attributes.component.html',
  styleUrls: ['./general-product-attributes.component.scss'],
})
export class GeneralProductAttributesComponent implements OnInit {
  constructor(
    public productsService: ProductsService,
  ) { }
  ngOnInit(): void {}
}
