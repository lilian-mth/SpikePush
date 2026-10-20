import Phaser from 'phaser';
import { GAME_CONFIG } from '../config/game_config.js';

export default class VirtualJoystick {
    constructor(scene, hudCamera, gameCamera, worldObjects) {
        this.scene = scene;
        this.hudCamera = hudCamera;
        this.pointerId = null;
        this.x = 0;
        this.y = 0;
        this.baseRadius = GAME_CONFIG.joystick.baseRadius;
        this.knobRadius = GAME_CONFIG.joystick.knobRadius;
        this.maxDistance = this.baseRadius - this.knobRadius;

        this.base = scene.add.circle(
            0,
            0,
            this.baseRadius,
            GAME_CONFIG.colors.joystickBase,
            GAME_CONFIG.joystick.baseAlpha
        )
            .setStrokeStyle(
                GAME_CONFIG.joystick.baseStrokeWidth,
                GAME_CONFIG.colors.joystickBase,
                GAME_CONFIG.joystick.baseStrokeAlpha
            )
            .setScrollFactor(0)
            .setDepth(1000);
        this.knob = scene.add.circle(
            0,
            0,
            this.knobRadius,
            GAME_CONFIG.colors.joystickKnob,
            GAME_CONFIG.joystick.knobAlpha
        )
            .setScrollFactor(0)
            .setDepth(1001);

        gameCamera.ignore([this.base, this.knob]);
        hudCamera.ignore(worldObjects);
        scene.input.on('pointerdown', this.handlePointerDown, this);
        scene.input.on('pointermove', this.handlePointerMove, this);
        scene.input.on('pointerup', this.handlePointerUp, this);
        scene.input.on('pointerupoutside', this.handlePointerUp, this);
        scene.scale.on('resize', this.reposition, this);
        scene.scale.on('resize', this.resizeCamera, this);
        scene.events.once(Phaser.Scenes.Events.SHUTDOWN, this.destroy, this);
        this.reposition();
        this.resizeCamera();
    }

    handlePointerDown(pointer) {
        if (this.pointerId !== null) {
            return;
        }

        const distance = Phaser.Math.Distance.Between(pointer.x, pointer.y, this.base.x, this.base.y);
        if (distance <= this.baseRadius * 1.5) {
            this.pointerId = pointer.id;
            this.moveKnob(pointer);
        }
    }

    handlePointerMove(pointer) {
        if (pointer.id === this.pointerId) {
            this.moveKnob(pointer);
        }
    }

    handlePointerUp(pointer) {
        if (pointer.id === this.pointerId) {
            this.pointerId = null;
            this.x = 0;
            this.y = 0;
            this.knob.setPosition(this.base.x, this.base.y);
        }
    }

    moveKnob(pointer) {
        const deltaX = pointer.x - this.base.x;
        const deltaY = pointer.y - this.base.y;
        const distance = Math.min(Math.hypot(deltaX, deltaY), this.maxDistance);
        const angle = Math.atan2(deltaY, deltaX);

        this.x = Math.cos(angle) * distance / this.maxDistance;
        this.y = Math.sin(angle) * distance / this.maxDistance;
        if (Math.hypot(this.x, this.y) < GAME_CONFIG.joystick.deadzone) {
            this.x = 0;
            this.y = 0;
        }

        this.knob.setPosition(
            this.base.x + Math.cos(angle) * distance,
            this.base.y + Math.sin(angle) * distance
        );
    }

    reposition() {
        const margin = GAME_CONFIG.joystick.margin;
        const x = margin + this.baseRadius;
        const y = this.scene.scale.height - margin - this.baseRadius;

        this.base.setPosition(x, y);
        this.knob.setPosition(x, y);
        this.pointerId = null;
        this.x = 0;
        this.y = 0;
    }

    resizeCamera() {
        this.hudCamera.setSize(this.scene.scale.width, this.scene.scale.height);
    }

    destroy() {
        this.scene.input.off('pointerdown', this.handlePointerDown, this);
        this.scene.input.off('pointermove', this.handlePointerMove, this);
        this.scene.input.off('pointerup', this.handlePointerUp, this);
        this.scene.input.off('pointerupoutside', this.handlePointerUp, this);
        this.scene.scale.off('resize', this.reposition, this);
        this.scene.scale.off('resize', this.resizeCamera, this);
    }
}
