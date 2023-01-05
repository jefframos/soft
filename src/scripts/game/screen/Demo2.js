import * as PIXI from 'pixi.js';
import Screen from '../../screenManager/Screen'
import UIButton1 from '../../game/ui/UIButton1'
import UIList from '../../game/ui/uiElements/UIList'
import utils from '../../utils';
import config from '../../config';
export default class Demo2 extends Screen {

    constructor(label) {
        super(label);

        this.container = new PIXI.Container()
        this.addChild(this.container);

        const lorem = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
        this.loremArray = lorem.split(" ");
        this.emojiArray = ['🙂', '😀', '😃', '😄', '😁', '🤓', '😎', '🥰', '🤩']

        this.font1 = new PIXI.TextStyle({
            fontFamily: 'retro',
            align: "center",
            dropShadow: true,
            dropShadowAngle: 1.5,
            fontSize: 24,
            dropShadowDistance: 3,
            fill: "#ffcd1a",
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

        this.textBoxes = [];

        this.spawnTextTimer = 2;
        this.currentSpawnTextTimer = 0.1;
    }

    addTextBox(source) {
        let bracketsIndex = source.indexOf('{')

        let brackets = []
        let stringIndex = 0;
        this.textStructure = [];
        if (bracketsIndex == -1) {
            this.textStructure.push({ type: 'text', source: source })
        }
        while (bracketsIndex >= 0) {

            if (bracketsIndex == -1) {
                break;
            }
            let bracketsEnd = source.indexOf('}', bracketsIndex + 1)
            brackets.push({ start: bracketsIndex + 1, end: bracketsEnd })
            stringIndex = bracketsEnd + 1;
            bracketsIndex = source.indexOf('{', bracketsIndex + 1)
        }

        for (let index = 0; index < brackets.length; index++) {
            const element = brackets[index];
            if (element.start > 0) {
                if (index > 0) {
                    this.textStructure.push({ type: 'text', source: source.substring(brackets[index - 1].end + 1, element.start - 1) })

                } else {
                    this.textStructure.push({ type: 'text', source: source.substring(0, element.start - 1) })
                }
            }
            this.textStructure.push({ type: 'sprite', source: source.substring(element.start, element.end) })
            if (index >= brackets.length - 1) {
                this.textStructure.push({ type: 'text', source: source.substring(element.end + 1, source.length) })
            }
        }

        let boxList = new PIXI.Container();

        let xPos = 0;
        let offsetY = 0;
        let lineHeight = 45;
        for (let index = 0; index < this.textStructure.length; index++) {
            if (this.textStructure[index].type == 'text') {
                let text = new PIXI.Text("0", this.font1)
                text.text = this.textStructure[index].source
                if (xPos + text.width > config.width) {
                    offsetY += 50
                    xPos = 0
                }
                text.x = xPos
                text.y = offsetY;
                boxList.addChild(text)
                xPos += text.width;
            } else if (this.textStructure[index].type == 'sprite') {
                //i know im repeating code here
                let sprite = new PIXI.Sprite();
                sprite.texture = PIXI.Texture.from(this.textStructure[index].source)
                if (xPos + sprite.width > config.width) {
                    offsetY += 50
                    xPos = 0
                }
                sprite.x = xPos
                sprite.y = offsetY;
                sprite.scale.set(lineHeight / sprite.height)
                boxList.addChild(sprite)
                xPos += sprite.width;
            }
        }

        boxList.lifeSpan = this.spawnTextTimer * 1.5;
        this.container.addChild(boxList)
        this.textBoxes.push(boxList);

    }
    build() {

    }
    generateText() {
        let length = Math.random() * 5 + 5;

        let str = '';
        for (let index = 0; index < length; index++) {
            let type = Math.random()
            if (type < 0.2) {
                let spriteID = Math.ceil(Math.random() * 150)
                let id = spriteID < 10 ? '00' + spriteID : spriteID < 100 ? '0' + spriteID : spriteID.toString();
                str += '{' + id + '} '
            } else if (type < 0.9) {
                str += this.loremArray[Math.floor(Math.random() * this.loremArray.length)] + ' '
            } else {
                str += this.emojiArray[Math.floor(Math.random() * this.emojiArray.length)] + ' '
            }
        }

        return str;
    }
    update(delta) {

        if (this.currentSpawnTextTimer > 0) {
            this.currentSpawnTextTimer -= delta;
            if (this.currentSpawnTextTimer <= 0) {

                this.currentSpawnTextTimer = this.spawnTextTimer * Math.random();
                this.addTextBox(this.generateText());
            }
        }

        for (let index = this.textBoxes.length - 1; index >= 0; index--) {
            const element = this.textBoxes[index];

            if (index > 0) {
                element.y = utils.lerp(element.y, this.textBoxes[index - 1].y + this.textBoxes[index - 1].height + 50, 0.5);
            } else {

                element.y = utils.lerp(element.y, 150, 0.5);
            }
            element.x = config.width / 2 - element.width / 2
            element.lifeSpan -= delta

            if (element.lifeSpan <= 0) {
                this.container.removeChild(element)
                this.textBoxes.splice(index, 1);
            }
        }
    }
}