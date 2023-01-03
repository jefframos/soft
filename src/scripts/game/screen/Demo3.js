import * as PIXI from 'pixi.js';
import Screen from '../../screenManager/Screen'
import UIButton1 from '../../game/ui/UIButton1'

export default class Demo3 extends Screen {

    constructor(label) {
        super(label);

        this.container = new PIXI.Container()
        this.addChild(this.container);


        let closeButton = new UIButton1('icon_close', 0xFFFFFF, 80, 80)
        closeButton.onClick.add(() => {
            this.screenManager.backScreen();
        })
        closeButton.x = 50
        closeButton.y = 50
        this.addChild(closeButton);
    }
    build() {

    }

    update(delta) {

    }
}