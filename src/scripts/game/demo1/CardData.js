export default class CardData {
    constructor(id) {
        this.cardID = id;


        this.spriteId = id < 10 ? '00' + id : id < 100 ? '0' + id : id.toString();
    }
}