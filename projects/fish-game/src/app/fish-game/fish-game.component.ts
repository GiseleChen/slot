import { Component, Input, OnInit } from '@angular/core';
import {
  IAnimationApp,
  IAnimationAppSoursePathList,
  IAnimationText,
  IAnimationSprite,
  LibAnimationService } from 'lib-animation';

import { aCourse } from './aCourse';
@Component({
  selector: 'app-fish-game',
  templateUrl: './fish-game.component.html',
  styleUrls: ['./fish-game.component.sass']
})
export class FishGameComponent implements OnInit {
  @Input('base-url') baseUrl = '/';
  private app: IAnimationApp;
  private soursePathList: IAnimationAppSoursePathList[] = aCourse;
  private width = 1024;
  private height = 768;
  private loadingMsg: IAnimationText;

  //储存背景，控制条， 加减按钮的图像数据
  private surface_bg: IAnimationSprite;
  //底部控制条图片对象
  private oImgBottom: IAnimationSprite;

  constructor(private animationService: LibAnimationService) {
  }

  ngOnInit(): void {
    this.createAnimationAPP();
    this.setLoadingMsg();
    this.setBaseUrlInSoursePathList();
    this.bindAnimationEvent();
  }

  private bindAnimationEvent() {
    this.app.loader(this.soursePathList).subscribe(
    (pross) => this.updateProssText(pross),
    err => {},
    () => {
      this.removeLoadingMsg()
      this.displayGame()
    });
  }

  private displayGame() {
    this.drawBackground();
    this.drawOImgBottom();
  }

  private drawOImgBottom() {
    this.oImgBottom = this.animationService.factorySprite(this.app.resources.bottom.spritesheet.textures.oImgBottom);
    this.oImgBottom.x = 129;
    this.oImgBottom.y = 699;
    this.app.stage.addChild(this.oImgBottom);
  }

  private drawBackground() {
    this.surface_bg = this.animationService.factorySprite(this.app.resources.bg.texture);
    this.surface_bg.width = this.app.screen.width;
    this.surface_bg.height = this.app.screen.height;
    this.app.stage.addChild(this.surface_bg);
  }

  private setLoadingMsg() {
    const basicText = this.animationService.factoryText('资源加载中...', {
      fill: ['#ffffff']
    });

    basicText.x = this.width / 2 - 100;
    basicText.y = this.height / 2 - 50;
    this.app.stage.addChild(basicText);

    this.loadingMsg = basicText;
  }

  private removeLoadingMsg() {
    if(!this.loadingMsg){
      return;
    }

    this.loadingMsg.destroy()
  }

  private updateProssText(pross: number) {
    this.loadingMsg.text = Math.ceil(pross) + '%';
  }

  private setBaseUrlInSoursePathList() {
    this.soursePathList.forEach(sourse => sourse.src = this.baseUrl + sourse.src);
  }

  private createAnimationAPP() {
    this.app = this.animationService.factory('fish-game', { width: this.width, height: this.height });
  }
}
