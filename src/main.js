import Phaser from 'phaser';
import GameScene from './scenes/game_scene.js';
import HomeScene from './scenes/home_scene.js';
import { GAME_CONFIG } from './config/game_config.js';

document.documentElement.style.setProperty('--page-background', GAME_CONFIG.colors.background);

const MAX_PIXEL_RATIO = 2;
const getGameResolution = () => {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
    return Math.ceil(Math.min(window.innerWidth, window.innerHeight) * pixelRatio);
};
const initialResolution = getGameResolution();

const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: initialResolution,
        height: initialResolution
    },
    antialias: true,
    pixelArt: false,
    roundPixels: false,
    physics: {
        default: 'arcade'
    },
    input: {
        activePointers: 2,
        touch: { capture: true }
    },
    backgroundColor: GAME_CONFIG.colors.background,
    scene: [HomeScene, GameScene]
};

const game = new Phaser.Game(config);
window.addEventListener('resize', () => {
    const resolution = getGameResolution();
    if (game.scale.width !== resolution || game.scale.height !== resolution) {
        game.scale.resize(resolution, resolution);
    }
});