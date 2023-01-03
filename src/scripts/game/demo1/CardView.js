
import * as PIXI from 'pixi.js';

export default class CardView extends PIXI.NineSlicePlane {
    constructor(texture = 'square_0002', width = 100, height = 150) {
        super(PIXI.Texture.from(texture), 20, 20, 20, 20)
        this.width = width
        this.height = height

        this.cardImage = new PIXI.Sprite();

        this.addChild(this.cardImage);

        this.cardImage.anchor.set(0.5)
        this.cardImage.scale.set(0.5)
        this.cardImage.x = width / 2
        this.cardImage.y = height / 2

    }

    updateTexture(textureID) {
        this.cardImage.texture = PIXI.Texture.from(textureID)
    }

}