import signals from 'signals';
import BaseComponent from './BaseComponent';

export default class Health extends BaseComponent{
    constructor() {
        super();
        this.currentHealth = 100;
        this.standrdHealth = 100;    

        this.gotDamaged = new signals.Signal();
        this.gotKilled = new signals.Signal(); 
    }
    reset(){
        this.currentHealth = this.standrdHealth;
    }
    damage(value){
        this.gotDamaged.dispatch(this, value);

        this.currentHealth-=value;
        if(this.currentHealth <= 0){
            this.gotKilled.dispatch(this);
        }
    }
}