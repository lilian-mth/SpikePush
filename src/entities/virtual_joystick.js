import Phaser from 'phaser';
import { GAME_CONFIG } from '../config/game_config.js';

export default class VirtualJoystick {
    constructor(scene, hudCamera, gameCamera, worldObjects) {
        this.scene = scene;
        this.hudCamera = hudCamera;
        this.pointerId = null;
        this.canvas = scene.sys.game.canvas;
        this.x = 0;
        this.y = 0;
        this.visible = false;
        this.pixelRatio = this.getPixelRatio();
        this.baseRadius = GAME_CONFIG.joystick.baseRadius * this.pixelRatio;
        this.knobRadius = GAME_CONFIG.joystick.knobRadius * this.pixelRatio;
        this.maxDistance = this.baseRadius - this.knobRadius;
        this.windowPointerDown = this.handlePointerDown.bind(this);
        this.windowPointerMove = this.handlePointerMove.bind(this);
        this.windowPointerUp = this.handlePointerUp.bind(this);

        this.base = scene.add.circle(
            0,
            0,
            this.baseRadius,
            GAME_CONFIG.colors.joystickBase,
            GAME_CONFIG.joystick.baseAlpha
        )
            .setStrokeStyle(
                GAME_CONFIG.joystick.baseStrokeWidth,
                GAME_CONFIG.colors.joystickStroke,
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
        this.setVisible(false);

        gameCamera.ignore([this.base, this.knob]);
        hudCamera.ignore(worldObjects);
        window.addEventListener('pointerdown', this.windowPointerDown, { passive: false });
        window.addEventListener('pointermove', this.windowPointerMove);
        window.addEventListener('pointerup', this.windowPointerUp);
        window.addEventListener('pointercancel', this.windowPointerUp);
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

        this.pointerId = pointer.pointerId;
        this.setVisible(true);
        const position = this.getGamePosition(pointer);
        this.setBasePosition(position.x, position.y);
        this.moveKnob(position);
        if (pointer.cancelable) {
            pointer.preventDefault();
        }
    }

    handlePointerMove(pointer) {
        if (pointer.pointerId === this.pointerId) {
            this.moveKnob(this.getGamePosition(pointer));
        }
    }

    handlePointerUp(pointer) {
        if (pointer.pointerId === this.pointerId) {
            this.pointerId = null;
            this.x = 0;
            this.y = 0;
            this.setVisible(false);
        }
    }

    getGamePosition(pointer) {
        const bounds = this.canvas.getBoundingClientRect();
        const scaleX = this.scene.scale.width / bounds.width;
        const scaleY = this.scene.scale.height / bounds.height;

        return {
            x: (pointer.clientX - bounds.left) * scaleX,
            y: (pointer.clientY - bounds.top) * scaleY
        };
    }

    moveKnob(position) {
        const deltaX = position.x - this.base.x;
        const deltaY = position.y - this.base.y;
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

    setBasePosition(x, y) {
        const padding = this.baseRadius;
        const maxX = Math.max(padding, this.scene.scale.width - padding);
        const maxY = Math.max(padding, this.scene.scale.height - padding);
        const boundedX = Phaser.Math.Clamp(x, padding, maxX);
        const boundedY = Phaser.Math.Clamp(y, padding, maxY);
        this.base.setPosition(boundedX, boundedY);
        this.knob.setPosition(boundedX, boundedY);
    }

    setVisible(visible) {
        this.visible = visible;
        this.base.setVisible(visible);
        this.knob.setVisible(visible);
    }

    reposition() {
        this.pointerId = null;
        this.x = 0;
        this.y = 0;
        this.setVisible(false);
    }

    resizeCamera() {
        this.hudCamera.setSize(this.scene.scale.width, this.scene.scale.height);
        this.pixelRatio = this.getPixelRatio();
        this.baseRadius = GAME_CONFIG.joystick.baseRadius * this.pixelRatio;
        this.knobRadius = GAME_CONFIG.joystick.knobRadius * this.pixelRatio;
        this.maxDistance = this.baseRadius - this.knobRadius;
        this.base.setRadius(this.baseRadius);
        this.knob.setRadius(this.knobRadius);
        this.reposition();
    }

    getPixelRatio() {
        return this.scene.scale.width / this.scene.sys.game.canvas.clientWidth;
    }

    destroy() {
        window.removeEventListener('pointerdown', this.windowPointerDown);
        window.removeEventListener('pointermove', this.windowPointerMove);
        window.removeEventListener('pointerup', this.windowPointerUp);
        window.removeEventListener('pointercancel', this.windowPointerUp);
        this.scene.scale.off('resize', this.reposition, this);
        this.scene.scale.off('resize', this.resizeCamera, this);
    }
}
