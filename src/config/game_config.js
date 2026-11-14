import Phaser from 'phaser';
import { Boot } from '../scenes/boot.js';
import { Game } from '../scenes/game.js';
import { Home } from '../scenes/home.js';

export const gameConfig = {
    type: Phaser.AUTO,
    parent: 'app', // L'ID de la balise HTML où le jeu s'affiche
    scale: {
        mode: Phaser.Scale.RESIZE,
        width: '100%',
        height: '100%'
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 0, x: 0 }
        }
    },
    scene: [Boot, Game, Home] 
};

