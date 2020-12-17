import {
  IAnimationApp,
  IAnimationCreateOption,
  IAnimationService,
} from './interface/ianimation-service';
import { Injectable } from '@angular/core';
import * as PIXI from 'pixi.js';
import { AnimationApp } from './classes/animation-app';
import {
  IAnimationText,
  IAnimationTextOption,
} from './interface/IAnimationText';
import { IAnimationSprite } from './interface/IAnimationSprite';
import { IAnimationContainer } from './interface/IAnimationContainer';
import { IAnimationBlurFilter } from './interface/IAnimationBlurFilter';
import { IAnimationGraphics } from './interface/IAnimationGraphics';

@Injectable({
  providedIn: 'root',
})
export class LibAnimationService implements IAnimationService {
  private PIXI = PIXI;

  constructor() {}

  factory(wrapperID: string, option?: IAnimationCreateOption): IAnimationApp {
    const dom = document.querySelector(`#${wrapperID}`);

    if (!dom) {
      throw Error(`can't find dome (id:${wrapperID})`);
    }

    const pixi: PIXI.Application = this.createApp(option);
    dom.appendChild(pixi.view);

    return new AnimationApp(pixi);
  }

  factoryText(text: string, option?: IAnimationTextOption): IAnimationText {
    let style: PIXI.TextStyle;

    if (option) {
      style = new PIXI.TextStyle(option);
    }

    return new PIXI.Text(text, style);
  }

  factorySprite(texture: PIXI.Texture): IAnimationSprite {
    return PIXI.Sprite.from(texture);
  }

  factoryContainer(): IAnimationContainer {
    return new PIXI.Container();
  }

  factoryBlurFilter(): IAnimationBlurFilter {
    return new PIXI.filters.BlurFilter();
  }

  factoryGraphics(): IAnimationGraphics {
    return new PIXI.Graphics();
  }

  private createApp(option?: IAnimationCreateOption): PIXI.Application {
    let type = 'WebGL';
    if (!this.PIXI.utils.isWebGLSupported()) {
      type = 'canvas';
    }

    this.PIXI.utils.sayHello(type);

    return new this.PIXI.Application(option);
  }
}
