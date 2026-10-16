export default class Player {
    constructor(scene, x, y) {
        this.scene = scene; // On garde une référence à la scène qui a créé le joueur

        // 1. Création graphique et physique
        this.sprite = scene.add.circle(x, y, 20, 0x00aaff);
        scene.physics.add.existing(this.sprite);
        this.sprite.body.setCircle(20);
        this.sprite.body.setCollideWorldBounds(true);

        // 2. Configuration des contrôles
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.wasdKeys = scene.input.keyboard.addKeys('Z,Q,S,D');
        
        this.speed = 300;
    }

    // Cette fonction sera appelée à chaque frame par la scène
    update() {
        this.sprite.body.setVelocity(0);

        // Mouvements horizontaux
        if (this.cursors.left.isDown || this.wasdKeys.Q.isDown) {
            this.sprite.body.setVelocityX(-this.speed);
        } else if (this.cursors.right.isDown || this.wasdKeys.D.isDown) {
            this.sprite.body.setVelocityX(this.speed);
        }

        // Mouvements verticaux
        if (this.cursors.up.isDown || this.wasdKeys.Z.isDown) {
            this.sprite.body.setVelocityY(-this.speed);
        } else if (this.cursors.down.isDown || this.wasdKeys.S.isDown) {
            this.sprite.body.setVelocityY(this.speed);
        }
    }
}