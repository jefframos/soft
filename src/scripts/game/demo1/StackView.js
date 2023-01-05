
import * as PIXI from 'pixi.js';
import CardView from './CardView';

export default class StackView extends PIXI.Container {
    constructor(stackModel) {
        super()
        this.stackModel = stackModel;
        this.cards = [];

        this.baseCard = new CardView()
        this.baseCard.tint = 0x747F7F;
        this.addChild(this.baseCard);
        this.stackContainer = new PIXI.Container();
        this.addChild(this.stackContainer);


        this.currentFrontCardIndex = 0;

        this.cardsShowing = 144;


        this.quantityLabel = new PIXI.BitmapText("0", { fontName: 'counter' });
        this.addChild(this.quantityLabel)
        this.quantityLabel.x = 50
        this.quantityLabel.y = 0
        this.quantityLabel.anchor.set(0.5, 0)

        this.topPosition = { x: 0, y: 0 };
    }
    reset() {
        this.stackContainer.children = [];
        this.cards = [];
        this.quantityLabel.text = this.cards.length;
        this.quantityLabel.y = 0;
    }
    drawStack(stack) {
        for (var i = 0; i < stack.cards.length; i++) {
            this.cards.push(new CardView());
            this.cards[i].y = i * 5
            this.cards[i].updateTexture(stack.cards[i].spriteId)
            this.stackContainer.addChild(this.cards[i]);

        }

        this.quantityLabel.text = this.cards.length;
        this.refreshStackView();

    }
    addCard(card, skipRefresh = false) {
        this.cards.push(card);
        this.stackContainer.addChild(card);


        this.quantityLabel.text = this.cards.length;
        if (!skipRefresh) {
            this.refreshStackView();
        }
    }
    popCard(skipRefresh = false) {
        if (this.cards.length) {
            let card = this.cards.pop();
            this.refreshStackView();
            this.stackContainer.removeChild(card);
            card.visible = true;
            this.quantityLabel.text = this.cards.length;

            return card
        }
    }
    refreshStackView() {
        this.refreshVisbles()
        this.refreshPositions()
    }
    refreshPositions() {
        let posAccum = 0
        for (var i = 0; i < this.cards.length; i++) {
            if (this.cards[i].visible) {
                this.cards[i].x = 0;
                this.cards[i].y = ++posAccum * -5;

                this.topPosition.x = this.cards[i].x;
                this.topPosition.y = this.cards[i].y;
            }
        }
        this.quantityLabel.y = this.topPosition.y;
    }
    refreshVisbles() {
        for (var i = 0; i < this.cards.length; i++) {
            if (i < this.cards.length - this.cardsShowing) {
                this.cards[i].visible = false;
            } else {
                this.cards[i].visible = true;

            }
        }
    }

    get globalTopPosition() {
        return { x: this.topPosition.x + this.x, y: this.topPosition.y + this.y };

    }

}