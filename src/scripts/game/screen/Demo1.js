import * as PIXI from 'pixi.js';

import CardStack from "../demo1/CardStack";
import CardView from "../demo1/CardView";
import Screen from '../../screenManager/Screen'
import StackView from '../demo1/StackView';
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

        this.cemiteryStack = new CardStack();
        this.cemiteryStackView = new StackView(this.cemiteryStack)
        this.container.addChild(this.cemiteryStackView)

        this.trantitionType = Demo1.FROM_STACK;
        this.cardTransition = new CardTransition()
        this.addChild(this.cardTransition);

        this.cardTransition.onCompleteTransition.add(this.completeTransition.bind(this))

        this.transitionTime = 1;
        this.transitionCounter = this.transitionTime;


        let closeButton = new UIButton1('icon_close', 0xFFFFFF, 80, 80)
        closeButton.onClick.add(() => {
            this.screenManager.backScreen();
        })
        closeButton.x = 50
        closeButton.y = 50
        this.addChild(closeButton);
    }
    build() {

        this.cardTransition.reset();
        this.cardStack.reset();
        this.cardStackView.reset();
        this.cemiteryStack.reset();
        this.cemiteryStackView.reset();

        this.transitionTime = 1;
        this.transitionCounter = this.transitionTime;

        this.cardStack.populate(144);
        this.cardStackView.drawStack(this.cardStack);

        this.cardStackView.x = 0;
        this.cardStackView.y = Math.random() * (config.height - 260) + 100;

        this.cemiteryStackView.x = config.width - 100;
        this.cemiteryStackView.y = Math.random() * (config.height - 260) + 100;

    }
    completeTransition(card, targetView) {
        this.cardStackView.refreshStackView()
        this.cemiteryStackView.refreshStackView()
        targetView.addCard(card);
    }
    sendCard(fromStack, toStack) {
        //remove from one model to another
        toStack.stackModel.addCard(fromStack.stackModel.popCard());

        let card = fromStack.popCard();

        //start transition from stack to stack
        let originTransition = { x: fromStack.x, y: fromStack.y }
        let targetPosition = { x: toStack.x, y: toStack.y };

        this.cardTransition.fromTo(card, originTransition, targetPosition, toStack, 2);
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
    }
}