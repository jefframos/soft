import CardData from "./CardData";
import utils from "../../utils";
export default class CardStack {
    constructor() {
        this.cards = [];
    }

    populate(total) {
        for (let i = 0; i < total - 1; i++) {
            this.addCard(i + 1);
        }
        utils.shuffle(this.cards);
    }
    reset() {
        this.cards = [];
    }
    addCard(id) {
        this.cards.push(new CardData(id));
    }
    popCard() {
        if (this.cards.length) {
            return this.cards.pop();
        }
    }
}