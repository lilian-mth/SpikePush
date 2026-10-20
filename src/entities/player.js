import Phaser from 'phaser';
import { GAME_CONFIG } from '../config/game_config.js';

export default class Player {
    constructor(scene, x, y, joystick) {
        this.joystick = joystick ?? { x: 0, y: 0 };
        this.sprite = scene.physics.add.sprite(
            x * GAME_CONFIG.unitPixels,
            y * GAME_CONFIG.unitPixels,
            'perso'
        );
        this.sprite.setOrigin(GAME_CONFIG.player.origin.x, GAME_CONFIG.player.origin.y);
        this.sprite.body.setCircle(
            GAME_CONFIG.player.hitboxRadiusUnits * GAME_CONFIG.unitPixels,
            GAME_CONFIG.player.hitboxOffsetUnits.x * GAME_CONFIG.unitPixels,
            GAME_CONFIG.player.hitboxOffsetUnits.y * GAME_CONFIG.unitPixels
        );
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

        if (dx !== 0 || dy !== 0) {
            const angleCible = Math.atan2(dy, dx);
            this.sprite.rotation = Phaser.Math.Angle.RotateTo(
                this.sprite.rotation,
                angleCible,
                GAME_CONFIG.player.rotationStep
            );
        }
    }
}