import Phaser from 'phaser';

export default class Player {
    constructor(scene, x, y) {
        this.sprite = scene.physics.add.sprite(x, y, 'perso');
        this.sprite.setOrigin(50 / 114, 75 / 150);
        this.sprite.body.setCircle(50, 0, 25);
        this.sprite.body.setCollideWorldBounds(true);
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.wasdKeys = scene.input.keyboard.addKeys('Z,Q,S,D');
        this.speed = 300;
    }

    update() {
        let dx = 0;
        let dy = 0;

        if (this.cursors.left.isDown || this.wasdKeys.Q.isDown) {
            dx = -1;
        } else if (this.cursors.right.isDown || this.wasdKeys.D.isDown) {
            dx = 1;
        }

        if (this.cursors.up.isDown || this.wasdKeys.Z.isDown) {
            dy = -1;
        } else if (this.cursors.down.isDown || this.wasdKeys.S.isDown) {
            dy = 1;
        }

        if (dx !== 0 && dy !== 0) {
            dx *= Math.SQRT1_2;
            dy *= Math.SQRT1_2;
        }

        this.sprite.body.setVelocity(dx * this.speed, dy * this.speed);

        if (dx !== 0 || dy !== 0) {
            const angleCible = Math.atan2(dy, dx);
            this.sprite.rotation = Phaser.Math.Angle.RotateTo(
                this.sprite.rotation,
                angleCible,
                Math.PI / 20
            );
        }
    }
}