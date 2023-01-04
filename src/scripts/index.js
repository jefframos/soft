import * as PIXI from 'pixi.js';
import Game from './Game';
import SoundManager from './soundManager/SoundManager'
import jsonManifest from './manifests/manifest-json'
import audioManifest from './manifests/manifest-audio'
import spritesheetManifest from './manifests/manifest'
import MainScreenManager from './game/screen/MainScreenManager';
import signals from 'signals';
import config from './config';

window.iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
window.isMobile = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i);

window.onAdds = new signals.Signal();
window.onStopAdds = new signals.Signal();
window.SOUND_MANAGER = new SoundManager();
const loader = new PIXI.Loader();


const jsons = [];
loadManifests();

function loadManifests() {
    for (var i = spritesheetManifest['default'].length - 1; i >= 0; i--) {
        let dest = 'assets/' + spritesheetManifest['default'][i]

        jsons.push(dest);
        loader.add(dest)
    }
    loader.load(afterLoadManifests);
}

function afterLoadManifests(evt) {

    for (var key in PIXI.utils.TextureCache) {
        var copyKey = key;
        copyKey = copyKey.substr(0, copyKey.length - 4)
        copyKey = copyKey.split('/')
        copyKey = copyKey[copyKey.length - 1]
        var temp = PIXI.utils.TextureCache[key];
        delete PIXI.utils.TextureCache[key];
        PIXI.utils.TextureCache[copyKey] = temp;
    }

    startLoader();

}


function startLoader() {

    for (var i = 0; i < jsonManifest.length; i++) {
        jsonManifest[i].url = jsonManifest[i].url.replace(/\\/, "/");
        let url = jsonManifest[i].url;
        loader.add(jsonManifest[i].id, url);
    }

    for (var i = 0; i < audioManifest.length; i++) {
        audioManifest[i].url = audioManifest[i].url.replace(/\\/, "/");
        let url = audioManifest[i].url.substr(0, audioManifest[i].url.length - 4);

        if (iOS) {
            url += '.mp3'
        } else {
            url += '.ogg'
        }

        loader.add(audioManifest[i].id, url)
    }
    loader
        .add('./assets/fonts/stylesheet.css')
        .load(configGame);


    loader.onProgress.add((e) => {
        game.updateLoader(e.progress)
    })
}

window.game = new Game(config);

function configGame(evt) {

    window.SOUND_MANAGER.load(audioManifest);
    window.RESOURCES = evt.resources;
    window.TILE_ASSSETS_POOL = []

    let screenManager = new MainScreenManager();
    game.screenManager = screenManager;
    game.stage.addChild(screenManager);
    game.initialize()
    game.start();
    game.resize();

    window.addEventListener("focus", myFocusFunction, true);
    window.addEventListener("blur", myBlurFunction, true);
}

window.onresize = function (event) {
    if (!window.game) return;
    window.game.resize();
};
function myFocusFunction() {
}

function myBlurFunction() {
}


window.onEscPressed = new signals();
window.onSpacePressed = new signals();

window.getKey = function (e) {
    if (window.GAMEPLAY_IS_STOP) return;
    if (e.key === "Escape") {
        window.onEscPressed.dispatch()
    }

    if (e.keyCode === 32) {
        window.onSpacePressed.dispatch()
    }
}

document.addEventListener('keydown', (event) => {
    window.getKey(event);
    event.preventDefault()
})


var startTime = Date.now();
var frame = 0;
window.FPS = 0
function tick() {
    var time = Date.now();
    frame++;
    if (time - startTime > 1000) {
        window.FPS = (frame / ((time - startTime) / 1000)).toFixed(1);
        startTime = time;
        frame = 0;
    }
    window.requestAnimationFrame(tick);
}
tick();

