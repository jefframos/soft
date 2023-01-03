import * as PIXI from 'pixi.js';
import * as dat from 'dat.gui';

import ScreenManager from '../../screenManager/ScreenManager';
import ScreenTransition from './ScreenTransition';
import config from '../../config';
import Demo1 from './Demo1';
import Demo2 from './Demo2';
import Demo3 from './Demo3';
import MenuScene from './MenuScene';

export default class MainScreenManager extends ScreenManager {
    constructor() {
        super();


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

        this.settings = {
            fps: 60
        }
        window.GUI = new dat.GUI({ closed: false });
        window.GUI.add(this.settings, 'fps', 1, 120).listen();

        this.backgroundContainer = new PIXI.Container();
        this.addChild(this.backgroundContainer);
        this.setChildIndex(this.backgroundContainer, 0);

        this.menu = new MenuScene('menu')
        this.addScreen(this.menu);

        this.demo1 = new Demo1('demo1')
        this.addScreen(this.demo1);

        this.demo2 = new Demo2('demo2')
        this.addScreen(this.demo2);

        this.demo3 = new Demo3('demo3')
        this.addScreen(this.demo3);

        this.forceChange('menu');

        this.menu.onRedirect.add((id) => {
            this.change(this.demos[id])
        })


        this.demos = ['demo1', 'demo2', 'demo3']
        this.timeScale = 1;
        this.isPaused = false;

    }

    update(delta) {
        this.settings.fps = window.FPS

        if (this.isPaused) return;
        super.update(delta * this.timeScale);

        if (this.currentPopUp) {
            this.currentPopUp.update(delta * this.timeScale)
        }
        if (this.prevPopUp && this.prevPopUp.toRemove && this.prevPopUp.parent) {
            this.prevPopUp.parent.removeChild(this.prevPopUp);
            this.prevPopUp = null;
        }
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