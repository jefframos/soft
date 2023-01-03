import * as PIXI from 'pixi.js';

import Screen from '../../screenManager/Screen'
import config from '../../config';
import UIList from '../../game/ui/uiElements/UIList'
import UIButton1 from '../../game/ui/UIButton1'
import signals from 'signals';

export default class MenuScene extends Screen {
    constructor(label) {
        super(label);

        this.menuList = new UIList();
        this.addChild(this.menuList);

        this.menuList.w = 200
        this.menuList.h = 400

        this.menuList.x = config.width / 2;
        this.menuList.y = config.height / 2 - 200;

        this.onRedirect = new signals.Signal();

        let demo1Button = this.menuList.addElement(new UIButton1('001', 0xFFFFFF, 200, 100));
        demo1Button.onClick.add(() => {
            this.onRedirect.dispatch(0)
        })
        let demo2Button = this.menuList.addElement(new UIButton1('001', 0xFFFFFF, 200, 100));
        demo2Button.onClick.add(() => {
            this.onRedirect.dispatch(1)
        })
        let demo3Button = this.menuList.addElement(new UIButton1('001', 0xFFFFFF, 200, 100));
        demo3Button.onClick.add(() => {
            this.onRedirect.dispatch(2)
        })
        this.menuList.updateVerticalList()
    }
}