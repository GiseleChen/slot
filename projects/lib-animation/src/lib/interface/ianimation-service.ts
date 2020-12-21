import { Observable } from 'rxjs';
import * as PIXI from 'pixi.js';
import { IAnimationText, IAnimationTextOption } from './IAnimationText'
import { IAnimationSprite } from './IAnimationSprite';
import { IAnimationContainer } from './IAnimationContainer';
import { IAnimationGraphics } from './IAnimationGraphics';
import { IAnimationBlurFilter } from './IAnimationBlurFilter';
import { IAnimationPolygon } from './IAnimationPolygon';
import { IAnimationTexture } from './IAnimationTexture';

export interface IAnimationAppSoursePathList {
  name: string;
  src: string;
}

export interface IAnimationApp{
  stage: PIXI.Container;
  resources: PIXI.IResourceDictionary;
  screen: PIXI.Rectangle;
  ticker: PIXI.Ticker;

  loader(soursePathList: IAnimationAppSoursePathList[]): Observable<number>;
}

export interface IAnimationCreateOption{
  width?: number;
  height?: number;
}

export interface IAnimationService {
  factory(wrapperID: string , option?: IAnimationCreateOption): IAnimationApp;
  factoryText(text: string, option?: IAnimationTextOption): IAnimationText;
  factorySprite(texture: PIXI.Texture ): IAnimationSprite;
  factoryContainer(): IAnimationContainer;
  factoryBlurFilter(): IAnimationBlurFilter;
  factoryGraphics(): IAnimationGraphics;
  factoryPolygon(): IAnimationPolygon;
  factoryTexture(img: string): IAnimationTexture;
}
