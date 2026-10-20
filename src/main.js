import Phaser from 'phaser';
import GameScene from './scenes/game_scene.js';

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
    scene: [GameScene]
};

new Phaser.Game(config);