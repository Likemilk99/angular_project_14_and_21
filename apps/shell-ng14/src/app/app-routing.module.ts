import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WidgetModernPageComponent } from './widget-modern-page/widget-modern-page.component';

const routes: Routes = [
  { path: 'widget-modern', component: WidgetModernPageComponent },
  { path: '', pathMatch: 'full', redirectTo: 'widget-modern' },
  { path: '**', redirectTo: 'widget-modern' }
];

@NgModule({ imports: [RouterModule.forRoot(routes)], exports: [RouterModule] })
export class AppRoutingModule {}
