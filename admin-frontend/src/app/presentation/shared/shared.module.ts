import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoaderComponent } from "./loader/loader.component";
import { ToasterComponent } from "./toaster/toaster.component";
import { NoRecordFoundComponent } from "./no-record-found/no-record-found.component";
@NgModule({
  declarations: [LoaderComponent, ToasterComponent, NoRecordFoundComponent],
  imports: [CommonModule],
  exports: [LoaderComponent, ToasterComponent, NoRecordFoundComponent],
})
export class SharedModule {}
