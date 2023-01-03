import * as PIXI from 'pixi.js';

import RenderModule from '../modules/RenderModule';

export default class GameView {
    constructor(gameObject) {
        this.layer = RenderModule.RenderLayers.Gameplay
        this.viewOffset = { x: 0, y: 0 }
        this.view = null;
        this.gameObject = gameObject;
        this.anchorOffset = 0;
    }
    get x(){
        return this.view.x
    }
    get y(){
        return this.view.y
    }
    update(delta) {
        //THE CAMERA IS DOING THIS


        // if (this.view) {
        //     this.view.x = this.gameObject.transform.position.x + this.viewOffset.x
        //     this.view.y = this.gameObject.transform.position.y + this.viewOffset.y


        //     // if (this.gameObject.physics.magnitude > 0) {
        //     //     this.anchorOffset += delta * 10;
        //     //     this.anchorOffset %= Math.PI
        //     // } else {
        //     //     this.anchorOffset = utils.lerp(this.anchorOffset, 0, 0.5)
        //     // }
        //     //  this.view.anchor.y = 1 + Math.sin(this.anchorOffset) * 0.5

        // }
    }
}