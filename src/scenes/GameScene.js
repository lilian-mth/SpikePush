import Phaser from 'phaser';
import Player from '../entities/Player.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        // L'identifiant unique de cette scène
        super('GameScene'); 
    }

    preload() {
        // Chargement des images/sons
    }

    create() {
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;

        // On crée une instance de notre classe Player
        // Le mot-clé "this" représente la scène actuelle
        this.player = new Player(this, centerX, centerY);
    }

    update() {
        // On dit au joueur de se mettre à jour (lire ses touches et bouger)
        this.player.update();
    }
}