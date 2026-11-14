import Phaser from 'phaser';

export class Home extends Phaser.Scene {
    constructor() {
        super('Home');
    }

    create() {
        const { centerX, centerY } = this.cameras.main;

        // Titre du jeu
        this.add.text(centerX, centerY - 100, 'SPIKEPUSH', {
            fontFamily: 'Arial',
            fontSize: '64px',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Bouton Jouer
        const playBtn = this.add.text(centerX, centerY + 50, 'JOUER', {
            fontFamily: 'Arial',
            fontSize: '40px',
            color: '#000000',
            backgroundColor: '#ffffff',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive(); // Rend le texte cliquable

        // Événement au clic
        playBtn.on('pointerdown', () => {
            this.scene.start('Game');
        });

        // Effets visuels au survol
        playBtn.on('pointerover', () => playBtn.setStyle({ backgroundColor: '#cccccc' }));
        playBtn.on('pointerout', () => playBtn.setStyle({ backgroundColor: '#ffffff' }));
    }
}