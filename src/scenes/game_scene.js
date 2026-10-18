import Phaser from 'phaser';
import Player from '../entities/player.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene'); 
    }

    preload() {
        // 'perso' est le nom de code (la clé) qu'on donne à cette image
        // 'assets/player.png' est le chemin vers le fichier
        this.load.image('perso', 'assets/player.png');
    }

    create() {
        const centreAreneX = 0;
        const centreAreneY = 0;
        const largeurArene = 1000;
        const hauteurArene = 1000;

        // --- NOUVEAU : Définir les limites de l'arène physique ---
        // On part de -500x, -500y pour que le point (0,0) soit exactement au centre du carré de 1000x1000
        this.physics.world.setBounds(
            -(largeurArene / 2), 
            -(hauteurArene / 2), 
            largeurArene, 
            hauteurArene
        );

        this.player = new Player(this, centreAreneX, centreAreneY);

        this.cameras.main.centerOn(centreAreneX, centreAreneY);
        this.ajusterZoom();
        this.scale.on('resize', this.ajusterZoom, this);
    }

    ajusterZoom() {
        // Définis ici la taille totale de ton arène mathématique (en pixels Phaser)
        // Par exemple, si ton arène fait 1000x1000 pixels :
        const largeurArene = 1000;
        const hauteurArene = 1000;
        
        // On calcule combien de fois l'arène rentre dans l'écran en largeur et en hauteur
        const ratioX = this.scale.width / largeurArene;
        const ratioY = this.scale.height / hauteurArene;

        // On garde le plus petit ratio pour s'assurer que RIEN n'est coupé
        // (Si l'écran est un téléphone vertical, c'est la largeur qui dictera le zoom.
        // Si c'est un écran PC très large, c'est la hauteur qui limitera.)
        let zoomOptimal = Math.min(ratioX, ratioY);

        // (Optionnel) Tu peux appliquer une petite marge (ex: 0.95 = 5% de marge noire autour de l'arène)
        zoomOptimal *= 0.95;

        // On applique le zoom fixe à la caméra
        this.cameras.main.setZoom(zoomOptimal);
        
        // On s'assure que la caméra reste bien centrée après avoir zoomé
        this.cameras.main.centerOn(0, 0); // Remets bien le centre de ton arène ici
    }

    update() {
        this.player.update();
    }
}