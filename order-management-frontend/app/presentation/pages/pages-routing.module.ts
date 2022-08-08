import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { AccessTeamRouteGuard } from '@presentation/shared/guards/access_team.guard';
import { BATCHES_URL, ELIGIBLE_ORDERS_URL, MISC_URL, SHIPPING_CAPACITY_URL } from '@data/constants/app-routing-url';
const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: BATCHES_URL,
      canActivate: [AccessTeamRouteGuard],
      loadChildren: () =>
      import('./batches/batches.module').then((m) => m.BatchesModule),
    },
    {
      path: SHIPPING_CAPACITY_URL,
      canActivate: [AccessTeamRouteGuard],
      loadChildren: () =>
      import('./shipping-capacity/shipping-capacity.module').then((m) => m.ShippingCapacityModule),
    },
    {
      path: ELIGIBLE_ORDERS_URL,
      canActivate: [AccessTeamRouteGuard],
      loadChildren: () =>
      import('./eligible-orders/eligible-orders.module').then((m) => m.EligibleOrdersModule),
    },
    {
      path: MISC_URL,
      loadChildren: () =>
      import('./miscellaneous/miscellaneous.module').then((m) => m.MiscellaneousModule),
    },
    {
      path: '',
      redirectTo: BATCHES_URL,
      pathMatch: 'full',
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
