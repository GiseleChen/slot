import { Component, OnInit, Input } from '@angular/core';
import {
  REEL_WIDTH,
  SYMBOL_SIZE,
  Row,
  Column,
  backoutType,
  endTurn,
  option,
  cards,
  slotTitle,
  speed,
  // aCourse,
} from '../config/game1.config';
import {
  IAnimationApp,
  IAnimationAppSoursePathList,
  IAnimationText,
  LibAnimationService,
} from 'lib-animation';
import { aCourse } from './aCourse';
import { IAnimationTexture } from 'dist/lib-animation/lib/interface/IAnimationTexture';

@Component({
  selector: 'app-slot-game',
  templateUrl: './slot-game.component.html',
  styleUrls: ['./slot-game.component.sass'],
})
export class SlotGameComponent implements OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input('base-url') baseUrl = '/';
  private app: IAnimationApp;
  private soursePathList: IAnimationAppSoursePathList[]; // = aCourse;
  private loadingMsg: IAnimationText;

  private REEL_WIDTH: number;
  private SYMBOL_SIZE: number;
  private running = false;
  private reels = [];
  private tweening = [];
  private backoutType: number;
  private endTurn: number;
  private Row: number;
  private Column: number;

  constructor(private animationService: LibAnimationService) {
    this.REEL_WIDTH = REEL_WIDTH;
    this.SYMBOL_SIZE = SYMBOL_SIZE;
    this.Row = Row;
    this.Column = Column;
    this.backoutType = backoutType;
    this.endTurn = endTurn;
    this.soursePathList = aCourse;
  }

  ngOnInit(): void {
    this.createAnimationAPP();
    this.setLoadingMsg();
    this.setBaseUrlInSoursePathList();
    this.bindAnimationEvent();
  }

  private bindAnimationEvent(): void {
    this.app.loader(this.soursePathList).subscribe(
      (pross) => this.updateProssText(pross),
      (err) => { },
      () => {
        this.removeLoadingMsg();
        this.ticket();
        this.onAssetsLoaded();
      }
    );
  }

  private setLoadingMsg(): void {
    const basicText = this.animationService.factoryText('资源加载中...', {
      fill: ['#ffffff'],
    });

    basicText.x = option.width / 2 - 100;
    basicText.y = option.height / 2 - 50;
    this.app.stage.addChild(basicText);

    this.loadingMsg = basicText;
  }

  private removeLoadingMsg(): void {
    if (!this.loadingMsg) {
      return;
    }

    this.loadingMsg.destroy();
  }

  private updateProssText(pross: number): void {
    this.loadingMsg.text = Math.ceil(pross) + '%';
  }

  private setBaseUrlInSoursePathList(): void {
    this.soursePathList.forEach(
      (sourse) => (sourse.src = this.baseUrl + sourse.src)
    );
  }

  private createAnimationAPP(): void {
    this.app = this.animationService.factory('slot-game', option);
  }

  private onAssetsLoaded(): void {
    let slotTextures: IAnimationTexture[];
    slotTextures = [];

    // cards.forEach((e) => {
    //   if (this.app.resources[e]) {
    //     slotTextures.push(
    //       this.animationService.factorySprite(this.app.resources[e].texture)
    //     );
    //   }
    // }

    cards.forEach((e) => {
      slotTextures.push(
        this.animationService.factoryTexture(e)
      );
    });

    // Build the reels
    const reelContainer = this.animationService.factoryContainer();
    for (let i = 0; i < this.Column; i++) {
      const rc = this.animationService.factoryContainer();
      rc.x = i * this.REEL_WIDTH;
      reelContainer.addChild(rc);

      const reel = {
        container: rc,
        symbols: [],
        position: 0,
        previousPosition: 0,
        blur: this.animationService.factoryBlurFilter(),
      };
      reel.blur.blurX = 0;
      reel.blur.blurY = 0;
      rc.filters = [reel.blur];
      for (let j = 0; j < this.Row; j++) {
        // const symbol = slotTextures[
        //   Math.floor(Math.random() * slotTextures.length)
        // ];
        const symbol = this.animationService.factorySprite(slotTextures[Math.floor(Math.random() * slotTextures.length)]);

        symbol.y = 0 * this.SYMBOL_SIZE;
        symbol.scale.x = symbol.scale.y = Math.min(
          this.SYMBOL_SIZE / symbol.width,
          this.SYMBOL_SIZE / symbol.height
        );
        symbol.x = Math.round((this.SYMBOL_SIZE - symbol.width) / 2);

        reel.symbols.push(symbol);
        rc.addChild(symbol);

      }
      this.reels.push(reel);

    }
    this.app.stage.addChild(reelContainer);

    // Build top & bottom covers and position reelContainer
    const margin = (option.height - this.SYMBOL_SIZE * 3) / 2;
    reelContainer.y = margin;
    reelContainer.x = Math.round(option.width - this.REEL_WIDTH * 5);
    const top = this.animationService.factoryGraphics();
    top.beginFill(0, 1);
    top.drawRect(0, 0, option.width, margin);
    const bottom = this.animationService.factoryGraphics();
    bottom.beginFill(0, 1);
    bottom.drawRect(0, this.SYMBOL_SIZE * 3 + margin, option.width, margin);

    // Add play text
    const style = {
      fontFamily: 'Arial',
      fontSize: 36,
      fontStyle: 'italic',
      fontWeight: 'bold',
      fill: ['#ffffff', '#00ff99'], // gradient
      stroke: '#4a1850',
      strokeThickness: 5,
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 6,
      wordWrap: true,
      wordWrapWidth: 440,
    };
    const playText = this.animationService.factoryText('開始', style);

    playText.x = Math.round((bottom.width - playText.width) / 2);
    playText.y =
      option.height - margin + Math.round((margin - playText.height) / 2);
    bottom.addChild(playText);

    // Add header text
    const headerText = this.animationService.factoryText(slotTitle, style);
    headerText.x = Math.round((top.width - headerText.width) / 2);
    headerText.y = Math.round((margin - headerText.height) / 2);
    top.addChild(headerText);

    this.app.stage.addChild(top);
    this.app.stage.addChild(bottom);

    // Set the interactivity.
    bottom.interactive = true;
    bottom.buttonMode = true;
    bottom.addListener('pointerdown', () => {
      this.startPlay();
    });

    // Listen for animate update.
    // const interval = setInterval((delta) => {
    this.app.ticker.add((delta) => {
      // Update the slots.
      this.reels.forEach((r) => {
        // Update blur filter y amount based on speed.
        // This would be better if calculated with time in mind also. Now blur depends on frame rate.
        r.blur.blurY = (r.position - r.previousPosition) * 8;
        r.previousPosition = r.position;

        // Update symbol positions on reel.
        for (let j = 0; j < r.symbols.length; j++) {
          const s = r.symbols[j];
          const prevy = s.y;
          s.y =
            ((r.position + j) % r.symbols.length) * this.SYMBOL_SIZE -
            this.SYMBOL_SIZE;
          if (s.y < 0 && prevy > this.SYMBOL_SIZE) {
            // Detect going over and swap a texture.
            // This should in proper product be determined from some logical reel.
            s.texture = slotTextures[
              Math.floor(Math.random() * slotTextures.length)
            ];

            s.scale.x = s.scale.y = Math.min(
              this.SYMBOL_SIZE / s.texture.width,
              this.SYMBOL_SIZE / s.texture.height
            );
            s.x = Math.round((this.SYMBOL_SIZE - s.width) / 2);
          }
        }
      });
    }, 10);
  }

  private lerp(a1, a2, t): number {
    return a1 * (1 - t) + a2 * t;
  }

  private ticket(): void {
    // Listen for animate update.
    // const interval = setInterval((delta) => {
    this.app.ticker.add((delta) => {
      const now = Date.now();
      const remove = [];
      this.tweening.forEach((t) => {
        const phase = Math.min(1, (now - t.start) / t.time);
        t.object[t.property] = this.lerp(
          t.propertyBeginValue,
          t.target,
          t.easing(phase)
        );
        if (t.change) {
          t.change(t);
        }
        if (phase === 1) {
          t.object[t.property] = t.target;
          if (t.complete) {
            t.complete(t);
          }
          remove.push(t);
        }
      });
      remove.forEach((item) => {
        this.tweening.splice(this.tweening.indexOf(item), 1);
      });

    }, 10);
  }

  // Function to start playing.
  private startPlay(): void {
    // console.log(this, 'startPlay');
    if (this.running) {
      return;
    }
    this.running = true;

    // 回彈的設定
    let amount = 0;
    amount =
      this.backoutType === 0
        ? 0.5
        : this.backoutType === 1
          ? 0
          : Math.random() * 100 > 50
            ? 0.5
            : 0;

    this.reels.forEach((r, i) => {
      const extra = Math.floor(Math.random() * 3);
      const target = r.position + 10 + i * 5 + extra;

      // 結束動畫結束順序？ 0: 同時結束, 1: 按順序結束, 2: 隨機結束
      const time = this.endTurn === 0 ? speed - (12 * i) :
              this.endTurn === 1 ? 400 + i * 600 : 400 + extra * 600;

      // let time = 2500; // + i * 600;// + extra * 600;

      this.tweenTo(
        r,
        'position',
        target,
        time,
        this.backout(amount),
        null,
        i === this.reels.length - 1 ? this.reelsComplete.bind(this) : null
      );
    });
  }

  private backout(amount): any {
    return (t) => --t * t * ((amount + 1) * t + amount) + 1;
  }

  private tweenTo(
    object,
    property,
    target,
    time,
    easing,
    onchange,
    oncomplete
  ): any {
    const tween = {
      object,
      property,
      propertyBeginValue: object[property],
      target,
      easing,
      time,
      change: onchange,
      complete: oncomplete,
      start: Date.now(),
    };
    this.tweening.push(tween);
    return tween;
  }

  // Reels done handler.
  private reelsComplete(): void {
    this.running = false;
  }
}
