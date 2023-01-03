import * as PIXI from 'pixi.js';
import signals from "signals";

export default class CardTransition extends PIXI.Container {
    constructor() {
        super()
        this.onCompleteTransition = new signals.Signal();
    }
    reset() {
        if (this.currentCard) {
            TweenLite.killTweensOf(this.currentCard, true)
            TweenLite.killTweensOf(this.currentCard.scale, true)
        }
    }
    fromTo(card, startPosition, endPosition, targetStack, duration) {
        this.currentCard = card;
        TweenLite.killTweensOf(card, true)
        TweenLite.killTweensOf(card.scale, true)

        this.addChild(card)


        card.x = startPosition.x;
        card.y = startPosition.y;

        let angle = Math.atan2(endPosition.y - startPosition.y, endPosition.x - startPosition.x) + Math.random() * 0.5 - 0.25;
        let distance = this.distance(startPosition.x, startPosition.y, endPosition.x, endPosition.y);


        TweenLite.to(card, duration * 0.5, {
            x: Math.cos(angle) * distance * 0.5 + startPosition.x,
            y: Math.sin(angle) * distance * 0.5 + startPosition.y,
            ease: Cubic.easeOut
        });

        TweenLite.to(card.scale, duration * 0.5, {
            x: 1.5,
            y: 1.5,
            ease: Back.easeOut
        });

        TweenLite.to(card, duration * 0.5, {
            delay: duration * 0.5,
            x: endPosition.x, y: endPosition.y, onComplete: () => {
                this.onCompleteTransition.dispatch(card, targetStack);
            }, ease: Cubic.easeIn
        });

        TweenLite.to(card.scale, duration * 0.5, {
            delay: duration * 0.5,
            x: 1,
            y: 1
        });
    }
    distance(x1, y1, x2, y2) {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    }
}