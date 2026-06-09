import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-widget-modern-page',
  template: `<iframe class="widget-frame" [src]="widgetUrl" title="Empty Angular 22 widget"></iframe>`
})
export class WidgetModernPageComponent {
  readonly widgetUrl: SafeResourceUrl;

  constructor(sanitizer: DomSanitizer) {
    this.widgetUrl = sanitizer.bypassSecurityTrustResourceUrl(environment.widgetModernUrl);
  }
}
