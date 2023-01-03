import GameObject from "../core/GameObject";
import Matter from "matter-js";
import PhysicsProperties from "../core/PhysicsProperties";

export default class PhysicsEntity extends GameObject {
    constructor() {
        super();
        this.rigidBody = null;
        this.type = null;
        this.viewOffset = {x:0, y:0}
        this.autoSetAngle = true;
    }
    
    get bodyID() {
        return this.rigidBody.id;
    }
    build() {
        this.physics = new PhysicsProperties();
    }
    setDebug(radius = 15, color = 0xFFFFFF) {

        //improve this debug to fit the body
        if (!this.debug) {
            this.debug = new PIXI.Sprite.from('debugRound')
            this.debug.anchor.set(0.5)
            this.debug.alpha = 0.1
            this.debug.tint = color;

            this.label = new PIXI.Text('')
            this.label.anchor.set(0.5,-1)
            this.label.alpha = 5

            this.label.style.fill = color;
            this.label.style.fontSize = 8
            this.debug.addChild(this.label)
            
        }
        this.debug.scale.set(radius / this.debug.width * 2)
        this.label.scale.set(1 / this.debug.scale.x)

        this.label.anchor.y = -1 / this.label.scale.x
    }
    destroy(){
        super.destroy();

        if(this.view){
            this.view.visible = false;
        }
    }
    buildRect(x, y, width, height, isStatic = false) {
        this.rigidBody = Matter.Bodies.rectangle(x, y, width, height, { isStatic: isStatic });
        this.rigidBody.gameObject = this;
        this.transform.position = this.rigidBody.position;
        this.type = 'rect'       
        
        this.engine.physics.addAgent(this)
        //this.rigidbodyAdded.dispatch(this)
        
        return this.rigidBody
    }
    buildCircle(x, y, radius, isStatic = false) {
        this.rigidBody = Matter.Bodies.circle(x, y, radius, { isStatic: false, restitution: 1 });
        this.rigidBody.gameObject = this;
        this.transform.position = this.rigidBody.position;
        this.type = 'circle'
        
        this.engine.physics.addAgent(this)
        //this.rigidbodyAdded.dispatch(this)

        return this.rigidBody
    }
    update(delta) {
    
        this.transform.position.x = this.rigidBody.position.x;
        this.transform.position.y = this.rigidBody.position.y;

        if(this.autoSetAngle && this.physics.magnitude > 0){
            this.transform.angle = Math.atan2(this.physics.velocity.y, this.physics.velocity.x); 
        }

        Matter.Body.setVelocity(this.rigidBody, this.physics.velocity)
        this.physics.angle = this.transform.angle

        if (this.debug) {
            this.debug.x = this.transform.position.x
            this.debug.y = this.transform.position.y
            this.debug.rotation = this.physics.angle
            this.label.rotation = - this.debug.rotation
            this.label.text = this.rigidBody.circleRadius + " - " + this.rigidBody.position.x.toFixed(1) + " - " + this.rigidBody.position.y.toFixed(1)
        }
    }

    set layerMask(value) {
        this.rigidBody.collisionFilter.mask = value;
    }
    set layerGroup(value) {
        this.rigidBody.collisionFilter.group = value;
    }
    set layerCategory(value) {
        this.rigidBody.collisionFilter.category = value;
    }
    /**
     * @param {number} value
     */
    set x(value) {        
        Matter.Body.setPosition(this.rigidBody, { x: value, y: this.rigidBody.position.y })
        this.transform.position.x = this.rigidBody.position.x;
    }
    /**
     * @param {number} value
     */
    set y(value) {
        Matter.Body.setPosition(this.rigidBody, { x: this.rigidBody.position.x, y: value })
        this.transform.position.y = this.rigidBody.position.y;
    }

}