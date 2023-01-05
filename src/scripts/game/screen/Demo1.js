import * as PIXI from 'pixi.js';

import CardStack from "../demo1/CardStack";
import CardView from "../demo1/CardView";
import Screen from '../../screenManager/Screen'
import StackView from '../demo1/StackView';
import CardTweenTransition from '../demo1/CardTweenTransition';
import CardTransition from '../demo1/CardTransition';
import config from '../../config';
import UIButton1 from '../../game/ui/UIButton1'

export default class Demo1 extends Screen {
    static FROM_STACK = 0;
    static FROM_CEMITERY = 1;
    constructor(label) {
        super(label);

        this.container = new PIXI.Container()
        this.addChild(this.container);

        this.cardStack = new CardStack();
        this.cardStackView = new StackView(this.cardStack)
        this.container.addChild(this.cardStackView)
        this.cardStackView._name = 'normal'

        this.cemiteryStack = new CardStack();
        this.cemiteryStackView = new StackView(this.cemiteryStack)
        this.container.addChild(this.cemiteryStackView)
        this.cemiteryStackView._name = 'cemitery'

        this.trantitionType = Demo1.FROM_STACK;
        this.cardTransition = new CardTransition()
        this.addChild(this.cardTransition);

        this.cardTransition.onCompleteTransition.add(this.completeTransition.bind(this))

        this.transitionTime = 1;
        this.transitionCounter = this.transitionTime;

        this.cardTransitionTween = new CardTweenTransition()
        this.cardTransitionTween.onCompleteTransition.add(this.completeTransition.bind(this))
        this.addChild(this.cardTransitionTween);

        this.currentTransition = this.cardTransition;

        let closeButton = new UIButton1('icon-home', 0xFF4858, 80, 80)
        closeButton.onClick.add(() => {
            this.screenManager.backScreen();
        })
        closeButton.x = 50
        closeButton.y = 50
        this.addChild(closeButton);

        this.movableDecks = { active: false, sin: 0 };


        this.helpLabel = new PIXI.BitmapText("Positions are different everytime\nthis screen is opened", { fontName: 'counter' });
        this.addChild(this.helpLabel)
        this.helpLabel.x = 100;
        this.helpLabel.y = 25
    }
    build(params = {}) {
        this.cardTransition.reset();
        this.cardTransitionTween.reset();

        this.transitionTime = params.drawTime ? params.drawTime : 1;
        if (params.transition == 'tween') {
            this.currentTransition = this.cardTransitionTween;
            this.movableDecks.active = false;

            this.cardStackView.x = 50;
            this.cardStackView.y = 900;

            this.cemiteryStackView.x = config.width - 150;
            this.cemiteryStackView.y = Math.random() * 300 + 600;

        } else {
            this.currentTransition = this.cardTransition;
            this.movableDecks.active = true;

            this.cardStackView.x = 50;
            this.cardStackView.y = config.height - 250;
        }

        this.cardStack.reset();
        this.cardStackView.reset();
        this.cemiteryStack.reset();
        this.cemiteryStackView.reset();

        this.transitionCounter = this.transitionTime;

        this.cardStack.populate(144);
        this.cardStackView.drawStack(this.cardStack);



    }
    completeTransition(card, targetView) {
        this.cardStackView.refreshStackView(true)
        this.cemiteryStackView.refreshStackView(true)

        targetView.addCard(card);
    }
    sendCard(fromStack, toStack) {
        //remove from one model to another
        toStack.stackModel.addCard(fromStack.stackModel.popCard());

        let card = fromStack.popCard();

        //start transition from stack to stack
        let originTransition = { x: fromStack.x + fromStack.topPosition.x, y: fromStack.y + fromStack.topPosition.y }
        let targetPosition = { x: toStack.x + toStack.topPosition.x, y: toStack.y + toStack.topPosition.y };

        this.currentTransition.fromTo(card, originTransition, targetPosition, toStack, 2);
    }
    sortTransition() {
        if (this.trantitionType == Demo1.FROM_STACK) {
            this.sendCard(this.cardStackView, this.cemiteryStackView);
            if (this.cardStack.cards.length <= 0) {
                this.trantitionType = Demo1.FROM_CEMITERY;
            }
        } else {
            this.sendCard(this.cemiteryStackView, this.cardStackView);
            if (this.cemiteryStack.cards.length <= 0) {
                this.trantitionType = Demo1.FROM_STACK;
            }

        }
    }
    update(delta) {

        this.transitionCounter -= delta;
        if (this.transitionCounter <= 0) {
            this.transitionCounter = this.transitionTime;
            this.sortTransition();
        }
        if (this.movableDecks.active) {
            this.movableDecks.sin += delta * 2;
            this.cemiteryStackView.x = config.width / 2 + Math.cos(this.movableDecks.sin) * 200 + 150;
            this.cemiteryStackView.y = config.height / 2 + Math.sin(this.movableDecks.sin) * 200;

            this.cardStackView.x = 150 + Math.sin(this.movableDecks.sin) * 50;
            this.cardStackView.y = 800;
        }
        if (this.currentTransition.update) {
            this.currentTransition.update(delta);
        }
    }
}