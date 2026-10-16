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
        default: 'arcade',
        arcade: { debug: true }
    },
    // On passe un tableau avec nos scènes importées
    scene: [GameScene] 
};

const game = new Phaser.Game(config);