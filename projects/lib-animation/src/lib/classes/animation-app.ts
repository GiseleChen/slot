import { Observable, Subscriber } from 'rxjs';
import { IAnimationApp, IAnimationAppSoursePathList } from '../interface/ianimation-service';
import * as PIXI from 'pixi.js';

export class AnimationApp implements IAnimationApp {
  stage: PIXI.Container;
  resources: PIXI.IResourceDictionary;
  screen: PIXI.Rectangle;
  ticker: PIXI.Ticker;

  constructor(private pixi: PIXI.Application) {
    this.stage = this.pixi.stage;
    this.screen = this.pixi.screen;
    this.ticker = this.pixi.ticker;
  }

  loader(soursePathList: IAnimationAppSoursePathList[]): Observable<number> {
    return new Observable(sub => {
      soursePathList.forEach(sourse => this.pixi.loader.add(sourse.name, sourse.src));
      this.bindLoaderEvent(sub); // called once when the queued resources all load.
      this.pixi.loader.load();
    });
  }

  private bindLoaderEvent(sub: Subscriber<number>) {
    const loader = this.pixi.loader;
    // 開始載入一個資源
    loader.onLoad.add(() => {
      console.log('load');
    }); // called once per loaded file

    // 載完一個資源
    loader.onProgress.add((snapshot: PIXI.Loader) => {
      console.log(snapshot.progress);
      sub.next(snapshot.progress);
    }); // called once per loaded/errored file

    // 資源出錯時
    loader.onError.add((err) => {
      console.log(err);
      sub.error(err);
    }); // called once per errored file

    // 全部載完資源時
    loader.onComplete.add(() => {
      console.log('onComplete');
      this.resources = this.pixi.loader.resources
      sub.complete();
    });
  }
}
