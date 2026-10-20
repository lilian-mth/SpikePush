import Phaser from 'phaser';
import GameScene from './scenes/game_scene.js';
import HomeScene from './scenes/home_scene.js';
import { GAME_CONFIG } from './config/game_config.js';

document.documentElement.style.setProperty('--page-background', GAME_CONFIG.colors.background);

const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    scale: {
        mode: Phaser.Scale.RESIZE,
        width: '100%',
        height: '100%'
    },
    resolution: window.devicePixelRatio || 1,
    autoRound: true,
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

new Phaser.Game(config);