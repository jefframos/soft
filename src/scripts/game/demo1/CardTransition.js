import * as PIXI from 'pixi.js';
import signals from "signals";

export default class CardTransition extends PIXI.Container {
    constructor() {
        super()
        this.onCompleteTransition = new signals.Signal();

        this.activeTransitions = [];
    }
    reset() {
        this.activeTransitions.forEach(transition => {
            this.onCompleteTransition.dispatch(transition.card, transition.targetStack);
        });
        this.activeTransitions = [];
    }
    fromTo(card, startPosition, endPosition, targetStack, duration) {
        this.addChild(card)

        card.x = startPosition.x;
        card.y = startPosition.y;

        let angle = Math.atan2(endPosition.y - startPosition.y, endPosition.x - startPosition.x) + Math.random();
        let distance = this.distance(startPosition.x, startPosition.y, endPosition.x, endPosition.y);

        this.activeTransitions.push({
            card: card,
            startPosition: startPosition,
            endPosition: endPosition,
            targetStack: targetStack,
            duration: duration,
            midPoint: { x: Math.cos(angle) * distance / 2, y: Math.sin(angle) * distance / 2 },
            velocity: { x: 0, y: 0 },
            distance: distance,
            currentDuration: duration
        })
    }

    update(delta) {


        for (let index = 0; index < this.activeTransitions.length; index++) {
            const transition = this.activeTransitions[index];
            transition.currentDuration -= delta;
            if (transition.currentDuration <= delta) {
                this.activeTransitions.splice(index, 1);
                transition.card.scale.set(1);
                this.onCompleteTransition.dispatch(transition.card, transition.targetStack);
                continue;
            }

            let angle = Math.atan2(transition.targetStack.y - transition.card.y, transition.targetStack.x - transition.card.x);
            let distance = this.distance(transition.card.x, transition.card.y, transition.targetStack.x, transition.targetStack.y);

            transition.velocity.x = Math.cos(angle) * (distance / transition.currentDuration) * delta
            transition.velocity.y = Math.sin(angle) * (distance / transition.currentDuration) * delta

            transition.card.x += transition.velocity.x;
            transition.card.y += transition.velocity.y;

            let distanceFromMiddle = this.distance(transition.currentDuration, 0, transition.duration, 0);

            transition.card.scale.set(Math.abs(distanceFromMiddle / transition.duration) * 0.25 + 1);
        }
    }
    distance(x1, y1, x2, y2) {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    }
}