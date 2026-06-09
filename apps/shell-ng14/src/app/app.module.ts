import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { WidgetModernPageComponent } from './widget-modern-page/widget-modern-page.component';

@NgModule({
  declarations: [AppComponent, WidgetModernPageComponent],
  imports: [BrowserModule, AppRoutingModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
