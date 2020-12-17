import { BrowserModule } from '@angular/platform-browser';
import { Injector, NgModule } from '@angular/core';

import { FishGameComponent } from './fish-game/fish-game.component';
import { createCustomElement } from '@angular/elements';
import { LibAnimationModule } from 'lib-animation';

@NgModule({
  declarations: [
    FishGameComponent
  ],
  imports: [
    BrowserModule,
    LibAnimationModule
  ],
  exports: [
    FishGameComponent
  ],
})
export class AppModule {
  constructor(private injector: Injector) { }

  ngDoBootstrap() {
    const FishGameElm = createCustomElement(FishGameComponent, {injector: this.injector});
    customElements.define('app-fish-game', FishGameElm);
  }
 }
