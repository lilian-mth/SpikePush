import Phaser from 'phaser';
import { ARENA_SIZE } from '../config/constants.js';

export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    create() {
        // Ajoute un fond gris matérialisant exactement la taille de ton arène
        this.add.rectangle(ARENA_SIZE / 2, ARENA_SIZE / 2, ARENA_SIZE, ARENA_SIZE, 0x333333);
        
        this.updateCamera();
        this.scale.on('resize', this.updateCamera, this);
    }

    updateCamera() {
        const screenWidth = this.scale.gameSize.width;
        const screenHeight = this.scale.gameSize.height;
        const minDimension = Math.min(screenWidth, screenHeight);

        // Calcule le zoom avec 5% de marge pour que l'arène ne colle pas aux bords
        const zoomLevel = minDimension / (ARENA_SIZE * 1.05);

        this.cameras.main.setZoom(zoomLevel);
        this.cameras.main.centerOn(ARENA_SIZE / 2, ARENA_SIZE / 2);
    }
}