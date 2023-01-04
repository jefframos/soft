import * as PIXI from 'pixi.js';
import Screen from '../../screenManager/Screen'
import UIButton1 from '../../game/ui/UIButton1'
import ParticleEmmiter from '../demo3/ParticleEmitter';
import ParticleDescriptor from '../demo3/ParticleDescriptor';
import AlphaBehaviour from '../demo3/ParticleBehaviour/AlphaBehaviour';
import SinoidBehaviour from '../demo3/ParticleBehaviour/SinoidBehaviour';
import ColorBehaviour from '../demo3/ParticleBehaviour/ColorBehaviour';
import config from '../../config';

export default class Demo3 extends Screen {

    constructor(label) {
        super(label);


        this.font1 = new PIXI.TextStyle({
            fontFamily: 'fredokaone',
            align: "center",
            dropShadow: true,
            dropShadowAngle: 1.5,
            fontSize: 24,
            dropShadowDistance: 3,
            fill: 0xFFFFFF,
            fontWeight: "bold",
            letterSpacing: 3,
            strokeThickness: 3,
        })


        let closeButton = new UIButton1('icon-home', 0xFF4858, 80, 80)
        closeButton.onClick.add(() => {
            this.screenManager.backScreen();
        })
        closeButton.x = 50
        closeButton.y = 50
        this.addChild(closeButton);

        this.particleContainer = new PIXI.ParticleContainer({ tint: true })
        this.addChild(this.particleContainer);

        this.particleContainerEmitter = new ParticleEmmiter(this.particleContainer);
        this.particleContainerEmitter.frequency = 1 / 60;


        this.container = new PIXI.Container()
        this.addChild(this.container);

        this.containerEmitter = new ParticleEmmiter(this.container);
        this.containerEmitter.frequency = 1 / 60;


        this.containerEmitterSmall = new ParticleEmmiter(this.container);
        this.containerEmitterSmall.frequency = 0.2;
        this.containerEmitterSmall.maxParticles = 10;

        this.containerEmitterSmall.x = config.width * 0.75;
        this.containerEmitterSmall.y = config.height * 0.75;

        this.particleContainerSmall = new ParticleEmmiter(this.container);
        this.particleContainerSmall.frequency = 0.2;
        this.particleContainerSmall.maxParticles = 10;


        this.particleContainerSmall.x = config.width * 0.25;
        this.particleContainerSmall.y = config.height * 0.75;


        this.largeFireDescriptor = new ParticleDescriptor(
            {
                velocityX: [-20, 20],
                velocityY: [-25, -55],
                gravity: [-20, -10],
                scale: [1, 3],
                lifeSpan: [2, 5],
                blendMode: PIXI.BLEND_MODES.ADD,
                texture: PIXI.Texture.from('star1')
            }
        )

        this.largeFireDescriptor.addBaseBehaviours(AlphaBehaviour, { time: [2, 4] })
        this.largeFireDescriptor.addBaseBehaviours(SinoidBehaviour, { speed: 1, length: [10, 40] })
        this.largeFireDescriptor.addBaseBehaviours(ColorBehaviour, { time: [2, 4], startValue: 0xff0000, endValue: 0xffff00 })


        this.smallFireDescriptor = new ParticleDescriptor(
            {
                velocityX: [-10, 10],
                velocityY: [-10, -25],
                gravity: [-20, -10],
                scale: [1, 3],
                lifeSpan: [2, 5],
                blendMode: PIXI.BLEND_MODES.ADD,
                texture: PIXI.Texture.from('star1')
            }
        )

        this.smallFireDescriptor.addBaseBehaviours(AlphaBehaviour, { time: [1, 3] })
        this.smallFireDescriptor.addBaseBehaviours(SinoidBehaviour, { speed: 1, length: [5, 10] })
        this.smallFireDescriptor.addBaseBehaviours(ColorBehaviour, { time: [1, 3], startValue: 0xff0000, endValue: 0xffff00 })


        this.emitTime = 0

        this.emittersRotation = 0;

        this.particleCounter1 = new PIXI.Text("0", this.font1)
        this.addChild(this.particleCounter1)
        this.particleCounter1.anchor.set(0.5, 0)

        this.particleCounter1small = new PIXI.Text("0", this.font1)
        this.addChild(this.particleCounter1small)
        this.particleCounter1small.anchor.set(0.5, 0)

        this.particleCounter2 = new PIXI.Text("0", this.font1)
        this.addChild(this.particleCounter2)
        this.particleCounter2.anchor.set(0.5, 0)

        this.particleCounter2small = new PIXI.Text("0", this.font1)
        this.addChild(this.particleCounter2small)
        this.particleCounter2small.anchor.set(0.5, 0)

        this.particleCounter1.x = config.width * 0.25
        this.particleCounter1.y = config.height * 0.35 + 20

        this.particleCounter1small.x = config.width * 0.25
        this.particleCounter1small.y = config.height * 0.75 + 20

        this.particleCounter2.x = config.width * 0.75
        this.particleCounter2.y = config.height * 0.35 + 20

        this.particleCounter2small.x = config.width * 0.75
        this.particleCounter2small.y = config.height * 0.75 + 20

        this.helpLabel = new PIXI.BitmapText("Uses two types of containers\nparticle container is faster but limited", { fontName: 'counter' });
        this.addChild(this.helpLabel)
        this.helpLabel.x = 100;
        this.helpLabel.y = 25
    }
    build(params) {
        if (params.single) {
            this.particleContainerEmitter.active = false;
            this.containerEmitter.active = false;
        } else {
            this.particleContainerEmitter.active = true;
            this.containerEmitter.active = true;
        }

        this.particleContainerEmitter.reset();
        this.containerEmitter.reset();
        this.containerEmitterSmall.reset();
        this.particleContainerSmall.reset();
    }

    update(delta) {

        this.emittersRotation += delta * 2;
        this.emittersRotation %= Math.PI * 2;

        this.particleContainerEmitter.x = config.width * 0.25 + Math.cos(this.emittersRotation) * 100;
        this.particleContainerEmitter.y = config.height * 0.35 + Math.sin(this.emittersRotation) * 100;


        this.containerEmitter.x = config.width * 0.75 + Math.cos(this.emittersRotation) * 100;
        this.containerEmitter.y = config.height * 0.35 + Math.sin(this.emittersRotation) * 100;


        this.particleCounter1.visible = this.particleContainerEmitter.active;
        this.particleCounter1small.visible = this.particleContainerSmall.active;
        this.particleCounter2.visible = this.containerEmitter.active;
        this.particleCounter2small.visible = this.containerEmitterSmall.active;

        this.particleCounter1.text = this.particleContainerEmitter.particles.length + '\nparticles container';
        this.particleCounter1small.text = this.particleContainerSmall.particles.length + '\nparticles container';
        this.particleCounter2.text = this.containerEmitter.particles.length + '\nnormal container\n+blend modes';
        this.particleCounter2small.text = this.containerEmitterSmall.particles.length + '\nnormal container\n+blend modes';

        if (this.particleContainerEmitter.canEmit) {
            this.particleContainerEmitter.emit(this.largeFireDescriptor, { minX: 0, maxX: 30, minY: 0, maxY: 5 }, 8)
        }

        if (this.containerEmitter.canEmit) {
            this.containerEmitter.emit(this.largeFireDescriptor, { minX: 0, maxX: 30, minY: 0, maxY: 5 }, 8)
        }

        if (this.containerEmitterSmall.canEmit) {
            this.containerEmitterSmall.emit(this.smallFireDescriptor, { minX: 0, maxX: 30, minY: 0, maxY: 5 }, 1)
        }
        if (this.particleContainerSmall.canEmit) {
            this.particleContainerSmall.emit(this.smallFireDescriptor, { minX: 0, maxX: 30, minY: 0, maxY: 5 }, 1)
        }

        this.particleContainerEmitter.update(delta);
        this.containerEmitter.update(delta);
        this.containerEmitterSmall.update(delta);
        this.particleContainerSmall.update(delta);
    }
}