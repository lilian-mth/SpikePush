import Phaser from 'phaser';

export default class Player {
    constructor(scene, x, y) {
        this.scene = scene;

        // 1. On remplace le cercle par notre image 'perso' chargée dans la scène
        // Au lieu de add.circle, on utilise physics.add.sprite
        this.sprite = scene.physics.add.sprite(x, y, 'perso');
        this.sprite.setOrigin(50/114, 75/150);
        
        // 2. (Optionnel) Si ton image Figma est trop grande ou trop petite, tu peux la redimensionner :
        // this.sprite.setScale(0.5); // Réduit la taille de moitié

        // 3. On garde la hitbox circulaire invisible pour la physique
        // (Ajuste le rayon '20' en fonction de la taille de ton image)
        this.sprite.body.setCircle(50, 0, 25);
        
        
        // (Optionnel) Si la hitbox rose (debug) n'est pas bien centrée sur ton image,
        // tu peux la décaler avec setOffset(x, y)
        // this.sprite.body.setOffset(5, 5); 

        this.sprite.body.setCollideWorldBounds(true);

        // Configuration des contrôles
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.wasdKeys = scene.input.keyboard.addKeys('Z,Q,S,D');
        this.speed = 300;
    }

    // Cette fonction sera appelée à chaque frame par la scène
    update() {
        this.sprite.body.setVelocity(0);
        let dx = 0;
        let dy = 0;
        // Mouvements horizontaux
        if (this.cursors.left.isDown || this.wasdKeys.Q.isDown) {
            dx = -1
        } else if (this.cursors.right.isDown || this.wasdKeys.D.isDown) {
            dx = 1
        }

        // Mouvements verticaux
        if (this.cursors.up.isDown || this.wasdKeys.Z.isDown) {
            dy = -1
        } else if (this.cursors.down.isDown || this.wasdKeys.S.isDown) {
            dy = 1;
        }

        if (dx*dx + dy*dy > 1.5){
            dx *= Math.sqrt(2) / 2;
            dy *= Math.sqrt(2) / 2;
        }
        this.sprite.body.setVelocityX(dx * this.speed);
        this.sprite.body.setVelocityY(dy * this.speed);

        // --- LA ROTATION FLUIDE ---
        if (dx !== 0 || dy !== 0) {
            // 1. On calcule l'angle CIBLE (vers où le joueur veut aller)
            const angleCible = Math.atan2(dy, dx);
            
            // 2. On demande à Phaser de tourner progressivement l'angle ACTUEL vers l'angle CIBLE.
            // Le 3ème chiffre (ici 0.1) est la vitesse de rotation.
            // - Plus il est proche de 0 (ex: 0.05), plus le joueur tournera lentement (lourd)
            // - Plus il est proche de 1 (ex: 0.5), plus le joueur tournera vite (nerveux)
            this.sprite.rotation = Phaser.Math.Angle.RotateTo(
                this.sprite.rotation, 
                angleCible, 
                Math.PI/20 
            );
        }
    }
}