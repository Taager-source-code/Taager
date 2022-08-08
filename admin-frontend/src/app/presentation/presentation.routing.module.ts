import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
const ROUTES: Array<Route> = [
  { path: "", redirectTo: "/login", pathMatch: "full" },
  {
    path: "",
    loadChildren: () => import("./auth/auth.module").then((m) => m.AuthModule),
  },
  {
    path: "",
    loadChildren: () =>
      import("./dashboard/dashboard.module").then((m) => m.DashboardModule),
  },
  { path: "**", redirectTo: "/login" },
];
@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(ROUTES)],
})
export class PresentationRoutingModule {}
