import * as PIXI from 'pixi.js';
import * as dat from 'dat.gui';

import Demo1 from './Demo1';
import Demo2 from './Demo2';
import Demo3 from './Demo3';
import Game from '../../Game';
import MenuScene from './MenuScene';
import ScreenManager from '../../screenManager/ScreenManager';
import ScreenTransition from './ScreenTransition';
import config from '../../config';
import utils from '../../utils';

export default class MainScreenManager extends ScreenManager {
    constructor() {
        super();

        this.backgroundColor = new PIXI.Graphics().beginFill(0xffffff).drawRect(-2500, -2500, 5000, 5000)
        this.backgroundColor.tint = 0x52CDDA;
        this.backgroundPattern = new PIXI.TilingSprite(PIXI.Texture.from('pattern'), 64, 64)
        this.addChildAt(this.backgroundPattern, 0)
        this.addChildAt(this.backgroundColor, 0)
        this.backgroundPattern.anchor.set(0.5);
        this.backgroundPattern.width = 5000
        this.backgroundPattern.height = 5000
        this.backgroundPattern.alpha = 0.15;

        //Generate Bitmap Font
        PIXI.BitmapFont.from('counter', {
            fontFamily: 'retro',
            align: "center",
            dropShadow: true,
            dropShadowAngle: 1.5,
            fontSize: 24,
            dropShadowDistance: 3,
            fill: "#ffcd1a",
            fontWeight: "bold",
            letterSpacing: 5,
            strokeThickness: 3,
            wordWrap: true,
            wordWrapWidth: 300
        });



        this.fpsLabel = new PIXI.BitmapText("0", { fontName: 'counter' });
        this.addChild(this.fpsLabel)

        this.backgroundContainer = new PIXI.Container();
        this.addChild(this.backgroundContainer);
        this.setChildIndex(this.backgroundContainer, 0);

        this.menu = new MenuScene('menu')
        this.addScreen(this.menu);

        this.demo1 = new Demo1('demo1')
        this.addScreen(this.demo1);


        this.demo3 = new Demo3('demo3')
        this.addScreen(this.demo3);

        this.forceChange('menu');

        this.menu.onRedirect.add((id, param) => {
            this.change(this.demos[id], param)

            if (id == 1) {
                utils.addColorTween(this.backgroundColor, this.backgroundColor.tint, 0, 1)
            } else {
                utils.addColorTween(this.backgroundColor, this.backgroundColor.tint, 0x52CDDA, 1)
            }
        })


        this.demos = ['demo1', 'demo3']
        this.timeScale = 1;
        this.isPaused = false;


        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams) {
            let debug = urlParams.get('debug');
            if (debug) {
                this.change(this.demos[debug - 1], { param: 'test' })
            }
        }

    }

    update(delta) {
        this.fpsLabel.text = 'FPS ' + Math.round(window.FPS)
        this.fpsLabel.x = config.width - this.fpsLabel.width - 5
        this.fpsLabel.y = config.height - this.fpsLabel.height - 5

        if (this.isPaused) return;
        super.update(delta * this.timeScale);

        if (this.currentPopUp) {
            this.currentPopUp.update(delta * this.timeScale)
        }
        if (this.prevPopUp && this.prevPopUp.toRemove && this.prevPopUp.parent) {
            this.prevPopUp.parent.removeChild(this.prevPopUp);
            this.prevPopUp = null;
        }

        this.backgroundPattern.x = config.width / 2
        this.backgroundPattern.y = config.height / 2

        this.backgroundPattern.tilePosition.x += delta * 15;
        this.backgroundPattern.tilePosition.y += delta * 15;

        this.backgroundColor.x = config.width / 2
        this.backgroundColor.y = config.height / 2
    }
    backScreen() {
        super.backScreen();
        utils.addColorTween(this.backgroundColor, this.backgroundColor.tint, 0x52CDDA, 1)
    }
    shake(force = 1, steps = 4, time = 0.25) {
        let timelinePosition = new TimelineLite();
        let positionForce = (force * 50);
        let spliterForce = (force * 20);
        let speed = time / steps;
        for (var i = steps; i >= 0; i--) {
            timelinePosition.append(TweenLite.to(this.screensContainer, speed, {
                x: Math.random() * positionForce - positionForce / 2,
                y: Math.random() * positionForce - positionForce / 2,
                ease: "easeNoneLinear"
            }));
        };

        timelinePosition.append(TweenLite.to(this.screensContainer, speed, {
            x: 0,
            y: 0,
            ease: "easeeaseNoneLinear"
        }));
    }
}