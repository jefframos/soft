import config from './config';
import utils from './utils';

window.config = config;
window.utils = utils;

window.console.warn = function () { }
window.console.groupCollapsed = function (teste) {
    return teste
} //('hided warnings')

window.MAX_NUMBER = 1000000;

window.MAIN_FONT = 'fredokaone'
window.SEC_FONT = 'poppins'



window.LABELS = {};
window.LABELS.LABEL1 = {
    fontFamily: window.MAIN_FONT,
    fontSize: '18px',
    fill: 0xFFFFFF,
    align: 'center',
    stroke: 0,
    strokeThickness: 4
}
window.LABELS.LABEL_CHEST = {
    fontFamily: window.SEC_FONT,
    fontSize: '18px',
    fill: 0xFFFFFF,
    align: 'center',
    stroke: 0xbb00bb,
    strokeThickness: 4,
}
window.LABELS.LABEL_SPACESHIP = {
    fontFamily: window.SEC_FONT,
    fontSize: '18px',
    fill: 0xFFFFFF,
    align: 'center',
    stroke: 0xFFFF00,
    strokeThickness: 4,
}
window.LABELS.LABEL_STATS = {
    fontFamily: window.SEC_FONT,
    fontSize: '14px',
    fill: 0xFFFFFF,
    align: 'center',
    stroke: 0,
    strokeThickness: 4
}

window.LABELS.LABEL2 = {
    fontFamily: window.SEC_FONT,
    fontSize: '24px',
    fill: 0xFFFFFF,
    align: 'center',
}

window.LABELS.LABEL_DAMAGE = {
    fontFamily: window.SEC_FONT,
    fontSize: '14px',
    fill: 0xFFFFFF,
    align: 'center',
    stroke: 0,
    strokeThickness: 4,
}

window.iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
window.isMobile = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i);