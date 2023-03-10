import * as PIXI from 'pixi.js';

export default class Screen extends PIXI.Container {
	constructor(label) {
		super();
		this.label = label;
		this.entityList = [];
		this.updateable = false;
		this.nextScreen;
		this.screenManager;
		this.built;
	}
	//add here the entities to easily remove after by parameter "kill"
	addChild(entity) {
		super.addChild(entity);
		this.entityList.push(entity);
	}
	//if the element is inside another, put here to force updates on the screen
	addOnUpdateList(entity) {
		for (let i = 0; i < this.entityList.length; i++) {
			if (this.entityList[i] == entity) {
				return;
			}
		}
		this.entityList.push(entity);
	}
	//update all childs
	update(delta) {
		if (!this.updateable) {
			return;
		}
		for (let i = 0; i < this.entityList.length; i++) {
			if (this.entityList[i].update) {
				this.entityList[i].update(delta);
			}
		}
		for (let i = 0; i < this.entityList.length; i++) {
			if (this.entityList[i].kill) {
				if (this.entityList[i].parent) {
					this.entityList[i].parent.removeChild(this.entityList[i]);
				}
				this.entityList.splice(i, 1);
			}
		}
	}

	destroy() {

	}
	build() {
		this.built = true;
	}
	transitionIn() {
		this.updateable = true;
		this.endTransitionIn();
	}
	endTransitionIn() {
	}
	transitionOut(nextScreen, param) {
		this.nextScreen = nextScreen;
		this.endTransitionOut(param);
	}
	endTransitionOut(param) {
		this.updateable = false;
		this.screenManager.forceChange(this.nextScreen.label, param);
		this.destroy();
	}
}
