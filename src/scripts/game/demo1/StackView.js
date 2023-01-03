
import * as PIXI from 'pixi.js';
import CardView from './CardView';

export default class StackView extends PIXI.Container {
    constructor(stackModel) {
        super()
        this.stackModel = stackModel;
        this.cards = [];

        this.baseCard = new CardView('square_0007')
        this.addChild(this.baseCard);
        this.stackContainer = new PIXI.Container();
        this.addChild(this.stackContainer);


        this.currentFrontCardIndex = 0;

        this.cardsShowing = 5;


        this.quantityLabel = new PIXI.BitmapText("0", { fontName: 'counter' });
        this.addChild(this.quantityLabel)
        this.quantityLabel.x = 50
        this.quantityLabel.y = 150
        this.quantityLabel.anchor.set(0.5)
    }
    reset() {
        this.stackContainer.children = [];
        this.cards = [];
    }
    drawStack(stack) {
        for (var i = 0; i < stack.cards.length; i++) {
            this.cards.push(new CardView());
            this.cards[i].y = i * 3
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
                this.cards[i].x = 0
                this.cards[i].y = ++posAccum * 3
            }
        }
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

}