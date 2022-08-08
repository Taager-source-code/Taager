import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UploadImageUseCase } from '@core/usecases/utilities/upload-image.usecase';
import { ProductsService } from '@presentation/@core/utils/products.service';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'ngx-image-carousel',
  templateUrl: './image-carousel.component.html',
  styleUrls: ['./image-carousel.component.scss'],
})
export class ImageCarouselComponent implements OnInit {
  @Input() imageUrlList: string[] = [];
  @Output() uploadedImagesURL = new EventEmitter<string[]>();
  @Output() deletedImageIndex = new EventEmitter<string[]>();
  selectedFiles?: FileList;
  isUploadingImages = false;
  constructor(
    public productsService: ProductsService,
    private uploadImageUseCase: UploadImageUseCase,
  ) {}
  ngOnInit(): void { }
  getFormDataFromFiles(files) {
    const formDataArray = [];
    if (files && files[0]) {
      const numberOfFiles = files.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const formData = new FormData();
        formData.append('image', files[i]);
        formDataArray.push(formData);
      }
    }
    return formDataArray;
  }
  uploadFiles(event) {
    this.selectedFiles = event.target.files;
    this.isUploadingImages = true;
    const formDataArray = this.getFormDataFromFiles(this.selectedFiles);
    forkJoin({
      ...formDataArray.map((file) =>
        this.uploadImageUseCase.execute(file),
      ),
    })
      .pipe(
        finalize(() => {
          this.isUploadingImages = false;
        }),
      )
      .subscribe((data) => {
        const urls = Object.values(data).map((item) => item.url);
        this.uploadedImagesURL.emit([...this.imageUrlList, ...urls]);
      });
  }
  removeImage(deletedIndex: number): void {
    this.deletedImageIndex.emit(this.imageUrlList.filter((url, idx) => idx !== deletedIndex));
  }
}
