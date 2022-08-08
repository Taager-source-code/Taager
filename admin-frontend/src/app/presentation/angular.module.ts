import { ClipboardModule } from "@angular/cdk/clipboard";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
@NgModule({
  exports: [
    ClipboardModule,
    ClipboardModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  imports: [
    ClipboardModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
})
export class AngularModule {}