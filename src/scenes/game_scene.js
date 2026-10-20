import Phaser from 'phaser';
import Player from '../entities/player.js';
import VirtualJoystick from '../entities/virtual_joystick.js';
import Wall from '../entities/wall.js';
import { GAME_CONFIG } from '../config/game_config.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        this.cameras.main.setBackgroundColor(GAME_CONFIG.colors.background);
        this.creerLimitesDuMonde();
        this.creerMurs();

        const start = GAME_CONFIG.player.startPositions[0];
        this.player = new Player(this, start.x, start.y);
        this.murs.forEach(({ rectangle }) => {
            this.physics.add.collider(this.player.sprite, rectangle);
        });

        if (this.sys.game.device.input.touch) {
            this.hudCamera = this.cameras.add(0, 0, this.scale.width, this.scale.height);
            this.hudCamera.setScroll(0, 0);
            this.joystick = new VirtualJoystick(
                this,
                this.hudCamera,
                this.cameras.main,
                [this.player.sprite, ...this.murs.map(({ rectangle }) => rectangle)]
            );
        } else {
            this.joystick = { x: 0, y: 0 };
        }

        this.player.joystick = this.joystick;

        this.ajusterZoom();
        this.scale.on('resize', this.ajusterZoom, this);
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.scale.off('resize', this.ajusterZoom, this);
        });
    }

    creerLimitesDuMonde() {
        const unit = GAME_CONFIG.unitPixels;
        const halfWidth = GAME_CONFIG.arena.width / 2;
        const halfHeight = GAME_CONFIG.arena.height / 2;
        const thickness = GAME_CONFIG.walls.thickness;

        this.physics.world.setBounds(
            (-halfWidth - thickness) * unit,
            (-halfHeight - thickness) * unit,
            (GAME_CONFIG.arena.width + 2 * thickness) * unit,
            (GAME_CONFIG.arena.height + 2 * thickness) * unit
        );
    }

    creerMurs() {
        const { width, height } = GAME_CONFIG.arena;
        const thickness = GAME_CONFIG.walls.thickness;
        const layouts = [
            {
                x: 0,
                y: -height / 2 - thickness / 2,
                width: width + 2 * thickness,
                height: thickness
            },
            {
                x: 0,
                y: height / 2 + thickness / 2,
                width: width + 2 * thickness,
                height: thickness
            },
            {
                x: -width / 2 - thickness / 2,
                y: 0,
                width: thickness,
                height: height + 2 * thickness
            },
            {
                x: width / 2 + thickness / 2,
                y: 0,
                width: thickness,
                height: height + 2 * thickness
            },
            ...GAME_CONFIG.walls.internal.map(({ column, row }) => ({
                x: -width / 2 + column + 0.5,
                y: -height / 2 + row + 0.5,
                width: 1,
                height: 1
            }))
        ];

        this.murs = layouts.map((layout) => new Wall(this, layout));
    }

    ajusterZoom() {
        const cameraWidth = GAME_CONFIG.camera.width * GAME_CONFIG.unitPixels;
        const cameraHeight = GAME_CONFIG.camera.height * GAME_CONFIG.unitPixels;
        const zoom = Math.min(
            this.scale.width / cameraWidth,
            this.scale.height / cameraHeight
        );

        this.cameras.main.setZoom(zoom);
        this.cameras.main.centerOn(0, 0);
    }

    update() {
        this.player.update();
    }
}
