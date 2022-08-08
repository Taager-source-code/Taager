import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ProductPreviewComponent } from "@taager-webapp/web-components";
import { AuthGuard } from "../guards/private.guard";
import { AdminComponent } from "./admin/admin.component";
const routes: Routes = [
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      { path: "admin", component: AdminComponent },
      { path: "admin/:orderMsg", component: AdminComponent },
      { path: "product-preview", component: ProductPreviewComponent },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
