
export default class Pool {
    static _instance;
    static get instance() {
        if (!Pool._instance) {
            Pool._instance = new Pool();
        }
        return Pool._instance;
    }
    constructor() {
        this.pool = {};
    }
    getElement(constructor) {

        if (this.pool[constructor.name]) {
            let elements = this.pool[constructor.name];
            if (elements.length > 0) {
                let element = elements.pop();
                return element;
            }
        } else {
            this.pool[constructor.name] = []
        }

        let newElement = new constructor();
        //console.log(constructor.name)
        if (Pool.Debug) {
            if (newElement.setDebug) {
                newElement.setDebug()
            }
        }
        return newElement;

    }

    returnElement(element) {
        if (!this.pool[element.constructor.name]) {
            this.pool[element.constructor.name] = []
        }

        this.pool[element.constructor.name].push(element)
    }
}