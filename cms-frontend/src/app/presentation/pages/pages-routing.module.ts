import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
const routes: Routes = [{
    path: '',
    component: PagesComponent,
    children: [
        {
            path: 'products',
            loadChildren: () => import('./products/products.module')
                .then(m => m.ProductsModule),
        },
        {
            path: 'bundles',
            loadChildren: () => import('./bundles/bundles.module')
                .then(m => m.BundlesModule),
        },
        {
            path: '',
            redirectTo: 'products',
            pathMatch: 'full',
        },
    ],
}];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PagesRoutingModule {
}
