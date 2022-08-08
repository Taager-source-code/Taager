import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';
import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { SidebarModule } from '@syncfusion/ej2-angular-navigations';
import { InternalCategoriesModule } from './categories/internal-categories/internal-categories.module';
import { ProductDialogModule } from './product-dialog/product-dialog.module';
import { CommercialCategoriesModule } from './categories/commercial-categories/commercial-categories.module';
@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    SidebarModule,
    InternalCategoriesModule,
    CommercialCategoriesModule,
    ProductDialogModule,
  ],
  declarations: [
    PagesComponent,
  ],
})
export class PagesModule {
}
