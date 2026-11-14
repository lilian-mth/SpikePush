import Phaser from 'phaser';
import { ASSETS } from '../config/assets_keys';

export class Boot extends Phaser.Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        const { centerX, centerY } = this.cameras.main;

        

        // À placer au début de ton preload()
        const progressBar = this.add.graphics();
        const maxWidth = 400;

        this.load.on('progress', (value) => {
            progressBar.clear(); // Efface le dessin précédent
            progressBar.fillStyle(0xffffff, 1); // Remplissage blanc opaque
            
            // x, y, largeur dynamique, hauteur
            progressBar.fillRect(centerX - (maxWidth/2), centerY, maxWidth * value, 30);
        });

        // Se déclenche quand tout est prêt
        this.load.on('complete', () => {
            // C'est ici que tu ajouteras la logique de connexion (cookies) plus tard
            this.scene.start('Home');
        });

        // Test : décommente la ligne suivante pour simuler un chargement lent si tu veux voir le texte
        for(let i = 0; i < 1000; i++) this.load.image(`logo${i}`, 'https://labs.phaser.io/assets/sprites/phaser2.png');
        this.load.image(ASSETS.player, '../../public/assets/player.png');
        this.load.image(ASSETS.spike, '../../public/assets/spike.png');
    }
}