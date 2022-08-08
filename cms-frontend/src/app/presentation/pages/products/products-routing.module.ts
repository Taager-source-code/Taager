import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ProductsComponent } from './products.component';
const routes: Routes = [{
    path: '',
    component: ProductsComponent,
}];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ProductsRoutingModule {
}
