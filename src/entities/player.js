import { GAME_CONFIG } from '../config/game_config.js';

export default class Player {
    constructor(scene, x, y, joystick) {
        this.joystick = joystick ?? { x: 0, y: 0 };
        const radius = GAME_CONFIG.player.diameterUnits * GAME_CONFIG.unitPixels / 2;
        this.sprite = scene.add.circle(
            x * GAME_CONFIG.unitPixels,
            y * GAME_CONFIG.unitPixels,
            radius,
            GAME_CONFIG.colors.player
        );
        scene.physics.add.existing(this.sprite);
        this.sprite.body.setCircle(radius);
        this.sprite.body.setCollideWorldBounds(true);
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.wasdKeys = scene.input.keyboard.addKeys('Z,Q,S,D');
        this.speed = GAME_CONFIG.player.speedUnitsPerSecond * GAME_CONFIG.unitPixels;
    }

    update() {
        let dx = this.joystick.x;
        let dy = this.joystick.y;

        if (this.cursors.left.isDown || this.wasdKeys.Q.isDown) {
            dx -= 1;
        } else if (this.cursors.right.isDown || this.wasdKeys.D.isDown) {
            dx += 1;
        }

        if (this.cursors.up.isDown || this.wasdKeys.Z.isDown) {
            dy -= 1;
        } else if (this.cursors.down.isDown || this.wasdKeys.S.isDown) {
            dy += 1;
        }

        const magnitude = Math.hypot(dx, dy);
        if (magnitude > 1) {
            dx /= magnitude;
            dy /= magnitude;
        }

        this.sprite.body.setVelocity(dx * this.speed, dy * this.speed);
    }
}