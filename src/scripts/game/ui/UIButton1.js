import * as PIXI from 'pixi.js';
import * as signals from 'signals';
import utils from '../../utils';

export default class UIButton1 extends PIXI.Container {
	constructor(icon, buttonColor = 0xFFFFFF, width = 65, height = 65, texture = 'button-1w') {
		super();
		this.build(icon, buttonColor, width, height, texture)
		return this;
	}
	build(icon, buttonColor = 0xFFFFFF, width = 65, height = 65, texture = 'button-1w') {
		this.w = width;
		this.h = height;

		this.mainContainer = new PIXI.Container();
		this.mainTexture = texture;
		if (!icon) {
			this.icon = new PIXI.Sprite();

		} else {
			if (icon instanceof PIXI.RenderTexture ||
				icon instanceof PIXI.Texture) {
				this.icon = new PIXI.Sprite();
				this.icon.texture = icon;
			} else {

				this.icon = PIXI.Sprite.from(icon);
			}
		}
		this.enabled = true;

		this.backShape = new PIXI.NineSlicePlane(
			PIXI.Texture.from(texture), 10, 10, 10, 10)
		this.backShape.width = width
		this.backShape.height = height
		this.backShape.pivot.set(width / 2, height / 2)
		this.backShape.tint = buttonColor;

		this.icon.anchor.set(0.5);
		this.updateIconScale();
		this.mainContainer.addChild(this.backShape);
		this.mainContainer.addChild(this.icon);
		this.addChild(this.mainContainer);

		this.onClick = new signals.Signal()

		this.on('touchstart', this.touchStart.bind(this));
		this.on('touchend', this.click.bind(this));
		this.interactive = true;
		this.buttonMode = true;
	}

	touchStart() {
	}
	changePivot(x, y) {

		this.backShape.pivot.set(this.w * x / 2, this.h * y / 2)

		this.icon.x = this.w * x + this.w / 2
		this.icon.y = this.h * y + this.h / 2
	}
	updateIconScale(scale = 0.7) {

		utils.resizeToFitAR({
			width: this.backShape.width * scale,
			height: this.backShape.height * scale
		}, this.icon)

	}
	updateRotation(rot, invertIcon = false) {

		this.backShape.rotation = rot

		if (invertIcon) {
			this.icon.rotation = -rot
		}
	}
	setIconColor(color) {
		this.icon.tint = color;
	}
	setColor(color) {
		this.backShape.tint = color;
	}
	updateIconTexture(texture) {
		this.icon.texture = texture;
	}
	disable() {
		this.enabled = false;
		this.icon.tint = 0;


	}
	enable() {
		this.enabled = true;
		this.icon.tint = 0xFFFFFF;

		this.backShape.texture = new PIXI.Texture.from(this.mainTexture);
	}
	click() {
		if (!this.enabled) return
		this.onClick.dispatch();
	}
	updateTextColor(color) {
		if (this.buttonLabel) {
			this.buttonLabel.style.fill = color;
		}
	}
	replaceIcon(icon) {
		if (this.icon && this.icon.parent) {
			this.icon.parent.removeChild(this.icon);
		}
		this.icon = icon;
		this.mainContainer.addChild(this.icon);

	}

	addLabel(label, style) {
		this.buttonLabel = new PIXI.Text(label, style);
		this.buttonLabel.anchor.set(0.5)
		this.addChild(this.buttonLabel);
	}
	updateTexture(texture) {
		this.icon.texture = PIXI.Texture.from(texture);
		this.updateIconScale();
	}
}
