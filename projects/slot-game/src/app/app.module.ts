import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { SlotGameComponent } from './slot-game/slot-game.component';
import { createCustomElement } from '@angular/elements';
import { LibAnimationModule } from 'lib-animation';


@NgModule({
  declarations: [
    SlotGameComponent
  ],
  imports: [
    BrowserModule,
    LibAnimationModule
  ],
  providers: [],
  exports: [
    SlotGameComponent
  ]
})
export class AppModule {
  constructor(private injector: Injector) { }

  ngDoBootstrap() {
    const SlotGameElm = createCustomElement(SlotGameComponent, {injector: this.injector});
    customElements.define('app-slot-game', SlotGameElm);
  }
 }
