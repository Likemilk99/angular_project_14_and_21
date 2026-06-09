import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <header class="shell-header">
      <strong>Angular 14 Shell</strong>
      <nav><a routerLink="/widget-modern" routerLinkActive="active">Angular 22 widget</a></nav>
    </header>
    <main><router-outlet></router-outlet></main>
  `
})
export class AppComponent {}
