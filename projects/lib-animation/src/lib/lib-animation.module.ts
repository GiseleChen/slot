import { NgModule } from '@angular/core';
import { LibAnimationComponent } from './lib-animation.component';
import { LibAnimationService } from './lib-animation.service';



@NgModule({
  declarations: [LibAnimationComponent],
  imports: [
  ],
  providers: [
    LibAnimationService
  ],
  exports: [LibAnimationComponent]
})
export class LibAnimationModule { }
