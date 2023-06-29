import * as PIXI from 'pixi.js';

import Screen from '../../screenManager/Screen'
import UIButton1 from '../../game/ui/UIButton1'
import UIList from '../../game/ui/uiElements/UIList'
import config from '../../config';
import signals from 'signals';

export default class MenuScene extends Screen {
    constructor(label) {
        super(label);

        this.menuList = new UIList();
        this.addChild(this.menuList);

        this.menuList.w = 400
        this.menuList.h = 650

        this.menuList.x = config.width / 2;
        this.menuList.y = config.height / 2 - 200;

        this.titleLabel = new PIXI.TextStyle({
            fontFamily: 'retro',
            align: "center",
            dropShadow: true,
            dropShadowAngle: 1.5,
            fontSize: 44,
            dropShadowDistance: 3,
            fill: [
                "#ff52f1",
                "#D9436B"
            ],
            fillGradientType: 1,
            fontWeight: "bold",
            letterSpacing: 1,
            strokeThickness: 3,
        })

        this.buttonLabel1 = new PIXI.TextStyle({
            fontFamily: 'retro',
            align: "center",
            dropShadow: true,
            dropShadowAngle: 1.5,
            fontSize: 20,
            dropShadowDistance: 3,
            fill: 0xFFFFFF,
            fontWeight: "bold",
            letterSpacing: 1,
            strokeThickness: 3,
        })

        this.onRedirect = new signals.Signal();

        this.topLabel = new PIXI.Text("Hello,\nMy name is Jeff", this.titleLabel);
        this.addChild(this.topLabel)
        this.topLabel.x = config.width / 2
        this.topLabel.y = 180
        this.topLabel.anchor.set(0.5, 0);
        this.topLabel.sin = 0;

        let demo1Button = this.menuList.addElement(new UIButton1(null, 0x05EC15, 400, 100));
        demo1Button.addLabel('Card transition\nusing TweenLite', this.buttonLabel1)
        demo1Button.onClick.add(() => {
            this.onRedirect.dispatch(0, { transition: 'tween' })
        })

        let demo1Button2 = this.menuList.addElement(new UIButton1(null, 0xBD8AF2, 400, 100));
        demo1Button2.addLabel('Card transition not\nusing TweenLite\n(Cool)', this.buttonLabel1)
        demo1Button2.onClick.add(() => {
            this.onRedirect.dispatch(0, { transition: 'update' })
        })

        let demo1Button3 = this.menuList.addElement(new UIButton1(null, 0xD9436B, 400, 100));
        demo1Button3.addLabel('Card transition not\nusing TweenLite\n(AND SUPER FAST)', this.buttonLabel1)
        demo1Button3.onClick.add(() => {
            this.onRedirect.dispatch(0, { transition: 'update', drawTime: 0.1 })
        })

        let demo3Button = this.menuList.addElement(new UIButton1(null, 0xF05832, 400, 100));
        demo3Button.addLabel('Fire using\n10 Sprites', this.buttonLabel1)
        demo3Button.onClick.add(() => {
            this.onRedirect.dispatch(1, { single: true })
        })

        let demo3Button2 = this.menuList.addElement(new UIButton1(null, 0xD9436B, 400, 100));
        demo3Button2.addLabel('More Particles', this.buttonLabel1)
        demo3Button2.onClick.add(() => {
            this.onRedirect.dispatch(1, { single: false })
        })

        this.menuList.updateVerticalList()
        this.menuList.sin = Math.PI;
    }
    update(delta) {
        this.topLabel.sin += delta * 3;
        this.topLabel.sin %= Math.PI * 2;

        this.topLabel.rotation = Math.sin(this.topLabel.sin) * 0.5
        this.topLabel.scale.set((Math.cos(this.topLabel.sin) * 0.5 + 1.5) * 0.5)

        this.menuList.sin += delta;
        this.menuList.sin %= Math.PI * 2;
        this.menuList.y = config.height / 2 - 200 + Math.sin(this.menuList.sin) * 30

    }
}