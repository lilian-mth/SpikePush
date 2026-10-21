import Phaser from 'phaser';
import Player from '../entities/player.js';
import Saw from '../entities/saw.js';
import GameHud from '../entities/game_hud.js';
import VirtualJoystick from '../entities/virtual_joystick.js';
import Wall from '../entities/wall.js';
import { GAME_CONFIG } from '../config/game_config.js';

const SIDES = ['left', 'right', 'top', 'bottom'];

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    preload() {
        GAME_CONFIG.saw.animationAssets.forEach((asset, index) =>
            this.load.image(`saw${index}`, asset)
        );
    }

    create() {
        this.waveNumber = 0;
        this.phase = 'waiting';
        this.intermissionTimer = null;
        this.gameOverTimer = null;
        this.saws = [];
        this.activeSaws = [];
        this.pendingRespawn = false;
        this.cameras.main.setBackgroundColor(GAME_CONFIG.colors.background);
        this.creerLimitesDuMonde();
        this.creerMurs();
        this.safeSpawnPositions = this.precomputeSafeSpawnPositions();

        const start = GAME_CONFIG.player.startPositions[0];
        this.player = new Player(this, start.x, start.y);
        this.murs.forEach(({ rectangle }) => {
            this.physics.add.collider(this.player.sprite, rectangle);
        });

        this.hudCamera = this.cameras.add(0, 0, this.scale.width, this.scale.height);
        this.hudCamera.setScroll(0, 0);
        this.hud = new GameHud(
            this,
            this.hudCamera,
            this.player.lives
        );
        this.createSaws();
        this.hudCamera.ignore([
            this.player.sprite,
            ...this.murs.map(({ rectangle }) => rectangle),
            ...this.saws.flatMap((saw) => saw.getWorldObjects())
        ]);
        this.cameras.main.ignore(this.hud.objects);

        if (this.sys.game.device.input.touch) {
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
        this.scale.on('resize', this.handleResize, this);
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.scale.off('resize', this.handleResize, this);
            this.intermissionTimer?.remove(false);
            this.gameOverTimer?.remove(false);
            this.destroySaws();
        });

        this.startWave();
    }

    handleResize() {
        this.ajusterZoom();
        this.hud.layout();
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
                side: 'top',
                x: 0,
                y: -height / 2 - thickness / 2,
                width: width + 2 * thickness,
                height: thickness
            },
            {
                side: 'bottom',
                x: 0,
                y: height / 2 + thickness / 2,
                width: width + 2 * thickness,
                height: thickness
            },
            {
                side: 'left',
                x: -width / 2 - thickness / 2,
                y: 0,
                width: thickness,
                height: height + 2 * thickness
            },
            {
                side: 'right',
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

        this.murs = layouts.map(({ side, ...layout }) => {
            const wall = new Wall(this, layout);
            wall.side = side;
            return wall;
        });
    }

    createSaws() {
        this.saws = SIDES.flatMap((side) =>
            Array.from({ length: GAME_CONFIG.saw.countPerSide }, (_, slot) => {
                const saw = new Saw(this, {
                    side,
                    slot,
                    walls: this.murs,
                    onWarningReady: () => this.startSawWaveWhenReady(),
                    onBlocked: () => this.checkSawMovementComplete()
                });
                saw.playerOverlap = this.physics.add.overlap(
                    this.player.sprite,
                    saw.hitbox,
                    () => this.damagePlayer(saw)
                );
                return saw;
            })
        );
    }

    precomputeSafeSpawnPositions() {
        const { width, height } = GAME_CONFIG.arena;
        const rows = Math.floor(height);
        const columns = Math.floor(width);
        const clearance = GAME_CONFIG.player.diameterUnits / 2 +
            GAME_CONFIG.player.respawnSafeMarginUnits;
        const positions = [];

        for (let row = 0; row < rows; row += 1) {
            for (let column = 0; column < columns; column += 1) {
                const x = -width / 2 + column + 0.5;
                const y = -height / 2 + row + 0.5;
                const blocked = this.murs.some((wall) =>
                    Math.abs(x - wall.x) < wall.width / 2 + clearance &&
                    Math.abs(y - wall.y) < wall.height / 2 + clearance
                );

                if (!blocked) {
                    positions.push({ x, y });
                }
            }
        }

        if (positions.length === 0) {
            throw new Error('Aucune position de réapparition sûre ne reste dans l’arène.');
        }

        return positions;
    }

    findSafeRespawnPosition() {
        const unit = GAME_CONFIG.unitPixels;
        const clearance = (
            GAME_CONFIG.player.diameterUnits / 2 +
            GAME_CONFIG.player.respawnSafeMarginUnits
        ) * unit;
        const safePositions = this.safeSpawnPositions.filter(({ x, y }) =>
            this.saws.every(({ hitbox }) =>
                Math.abs(x * unit - hitbox.x) >= hitbox.body.width / 2 + clearance ||
                Math.abs(y * unit - hitbox.y) >= hitbox.body.height / 2 + clearance
            )
        );

        return safePositions.length > 0 ? Phaser.Math.RND.pick(safePositions) : null;
    }

    respawnPlayer() {
        const position = this.findSafeRespawnPosition();
        if (!position) {
            this.pendingRespawn = true;
            this.player.sprite.body.setVelocity(0, 0);
            this.player.sprite.body.setEnable(false);
            return;
        }

        this.pendingRespawn = false;
        this.tweens.killTweensOf(this.player.sprite);
        this.player.respawn(position.x, position.y);
    }

    startWave() {
        if (this.phase === 'gameOver') {
            return;
        }

        this.waveNumber += 1;
        this.phase = 'warning';
        this.activeSide = Phaser.Math.RND.pick(SIDES);
        this.activeSaws = this.saws.filter((saw) => saw.side === this.activeSide);

        const duration = Math.max(
            GAME_CONFIG.waves.warningMinimumDurationMs,
            GAME_CONFIG.waves.warningDurationMs -
                (this.waveNumber - 1) * GAME_CONFIG.waves.warningReductionPerWaveMs
        );
        this.activeSaws.forEach((saw) => saw.prepareWarning(duration));
    }

    startSawWaveWhenReady() {
        if (this.phase !== 'warning' || !this.activeSaws.every((saw) => saw.warningReady)) {
            return;
        }

        this.startSawWave();
    }

    startSawWave() {
        if (this.phase === 'gameOver') {
            return;
        }

        this.phase = 'extend';
        const speedUnits = Math.min(
            GAME_CONFIG.waves.maximumSpeedUnitsPerSecond,
            GAME_CONFIG.waves.speedUnitsPerSecond +
                (this.waveNumber - 1) * GAME_CONFIG.waves.speedIncreasePerWave
        );
        const speed = speedUnits * GAME_CONFIG.unitPixels;
        this.activeSaws.forEach((saw) => {
            saw.move('extend', speed);
        });
    }

    damagePlayer(saw) {
        if (this.pendingRespawn || !this.player.sprite.body.enable ||
            !saw.damagePlayer(this.player)) {
            return;
        }

        this.pendingRespawn = true;
        this.hud.setLives(this.player.lives);
        this.tweens.add({
            targets: this.player.sprite,
            alpha: 0.25,
            yoyo: true,
            repeat: 2,
            duration: 90,
            onComplete: () => this.player.sprite.setAlpha(1)
        });

        if (this.player.lives === 0) {
            this.gameOverTimer ??= this.time.delayedCall(0, this.endGame, [], this);
        } else {
            this.player.sprite.body.setVelocity(0, 0);
            this.player.sprite.body.setEnable(false);
        }
    }

    checkSawMovementComplete() {
        if (!this.activeSaws.every((saw) => saw.blocked)) {
            return;
        }

        if (this.phase === 'extend') {
            this.phase = 'retract';
            const speed = Math.min(
                GAME_CONFIG.waves.maximumSpeedUnitsPerSecond,
                GAME_CONFIG.waves.speedUnitsPerSecond +
                    (this.waveNumber - 1) * GAME_CONFIG.waves.speedIncreasePerWave
            ) * GAME_CONFIG.unitPixels;
            this.activeSaws.forEach((saw) => saw.move('retract', speed));
        } else if (this.phase === 'retract') {
            this.finishWave();
        }
    }

    finishWave() {
        this.activeSaws.forEach((saw) => saw.reset());
        if (this.pendingRespawn) {
            if (this.player.lives > 0) {
                this.respawnPlayer();
            }
        }
        this.activeSaws = [];
        this.phase = 'intermission';
        this.intermissionTimer = this.time.delayedCall(
            GAME_CONFIG.waves.betweenWavesMs,
            this.startWave,
            [],
            this
        );
    }

    endGame() {
        this.phase = 'gameOver';
        this.intermissionTimer?.remove(false);
        this.gameOverTimer?.remove(false);
        this.saws.forEach((saw) => saw.reset());
        this.player.sprite.body.setVelocity(0, 0);
        this.player.sprite.body.setEnable(false);
        this.scene.launch('GameOverScene');
        this.scene.pause();
    }

    destroySaws() {
        this.saws.forEach((saw) => saw.destroy());
        this.saws = [];
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

    update(time, delta) {
        if (this.phase !== 'gameOver') {
            this.saws.forEach((saw) => saw.update(delta));
            if (this.player.sprite.body.enable) {
                this.player.update();
            }
        }
    }
}
