import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CountrySelectionComponent } from './presentation/pages/country-selection/country-selection.component';
export const routes: Routes = [
  {
    path: 'pages',
    loadChildren: () => import('./presentation/pages/pages.module')
      .then(m => m.PagesModule),
  },
  {
    path: 'country-selection',
    component: CountrySelectionComponent,
  },
  { path: '', redirectTo: 'pages', pathMatch: 'full' },
  { path: '**', redirectTo: 'pages' },
];
const config: ExtraOptions = {
  useHash: false,
};
@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}