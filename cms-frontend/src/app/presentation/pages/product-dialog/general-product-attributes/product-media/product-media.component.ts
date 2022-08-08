import { Component, OnInit } from '@angular/core';
import { ProductsService } from '@presentation/@core/utils/products.service';
@Component({
  selector: 'ngx-product-media',
  templateUrl: './product-media.component.html',
  styleUrls: ['./product-media.component.scss'],
})
export class ProductMediaComponent implements OnInit {
  imageLinks: string[] = [];
  videoLinks = [{ url: '' }];
  constructor(
    public productsService: ProductsService,
  ) {}
  ngOnInit(): void {
    this.imageLinks = this.productsService.productForm.get('productMediaForm').get('imageUrls').value;
    this.videoLinks = this.productsService.productForm.get('productMediaForm').get('videosLinks').value;
  }
  addLink(ev) {
    ev.preventDefault();
    this.videoLinks.push({ url: '' });
    this.productsService.productForm.get('productMediaForm').get('videosLinks').setValue(this.videoLinks);
  }
  removeLink(index) {
    this.videoLinks = this.videoLinks.filter((element, i) => i !== index);
    this.productsService.productForm.get('productMediaForm').get('videosLinks').setValue(this.videoLinks);
  }
  onVideoLinkChange(ev, index) {
    this.videoLinks[index] = { url: ev.target.value };
    this.productsService.productForm.get('productMediaForm').get('videosLinks').setValue(this.videoLinks);
  }
  onUpdateImages(imagesArray: string[]): void {
    this.imageLinks = imagesArray;
    this.productsService.productForm.get('productMediaForm').get('imageUrls').setValue(this.imageLinks);
  }
}
