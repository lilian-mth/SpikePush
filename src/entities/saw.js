import { GAME_CONFIG } from '../config/game_config.js';

const DIRECTIONS = {
    left: { x: 1, y: 0, rotation: 0 },
    right: { x: -1, y: 0, rotation: Math.PI },
    top: { x: 0, y: 1, rotation: Math.PI / 2 },
    bottom: { x: 0, y: -1, rotation: -Math.PI / 2 }
};

export default class Saw {
    constructor(scene, { side, slot, walls, onWarningReady, onBlocked }) {
        this.scene = scene;
        this.side = side;
        this.direction = DIRECTIONS[side];
        this.onWarningReady = onWarningReady;
        this.onBlocked = onBlocked;
        this.phase = 'waiting';
        this.blocked = false;
        this.warningReady = false;
        this.speed = 0;
        this.animationTime = 0;
        this.animationFrame = 0;

        const unit = GAME_CONFIG.unitPixels;
        const { width, height } = GAME_CONFIG.arena;
        const radiusUnits = GAME_CONFIG.saw.diameterUnits / 2;
        const isHorizontal = this.direction.x !== 0;
        const laneSpan = isHorizontal ? height : width;
        const lanePosition = -laneSpan / 2 +
            (slot + 0.5) * laneSpan / GAME_CONFIG.saw.countPerSide;
        const edge = isHorizontal ? width / 2 : height / 2;

        this.startX = isHorizontal
            ? -this.direction.x * (edge + radiusUnits)
            : lanePosition;
        this.startY = isHorizontal
            ? lanePosition
            : -this.direction.y * (edge + radiusUnits);
        this.targetPosition = this.findStopPosition(walls, lanePosition, isHorizontal);

        const worldX = this.startX * unit;
        const worldY = this.startY * unit;
        const diameter = GAME_CONFIG.saw.diameterUnits * unit;
        this.sprite = scene.add.image(worldX, worldY, 'saw0')
            .setDisplaySize(diameter, diameter)
            .setDepth(GAME_CONFIG.saw.depth);

        this.hitbox = scene.add.circle(worldX, worldY, diameter / 2).setVisible(false);
        scene.physics.add.existing(this.hitbox);
        this.hitbox.body.setCircle(diameter / 2);
        this.hitbox.body.setAllowGravity(false);

        this.onPostUpdate = () => {
            this.sprite.setPosition(this.hitbox.x, this.hitbox.y);
        };
        scene.events.on('postupdate', this.onPostUpdate);
    }

    findStopPosition(walls, lanePosition, isHorizontal) {
        const direction = isHorizontal ? this.direction.x : this.direction.y;
        const halfSize = GAME_CONFIG.saw.diameterUnits / 2;
        const start = isHorizontal ? this.startX : this.startY;
        let stop = direction > 0 ? Infinity : -Infinity;

        walls.forEach((wall) => {
            if (wall.side === this.side) {
                return;
            }

            const laneCenter = isHorizontal ? wall.y : wall.x;
            const laneSize = isHorizontal ? wall.height : wall.width;
            if (lanePosition + halfSize <= laneCenter - laneSize / 2 ||
                lanePosition - halfSize >= laneCenter + laneSize / 2) {
                return;
            }

            const axisCenter = isHorizontal ? wall.x : wall.y;
            const axisSize = isHorizontal ? wall.width : wall.height;
            const wallFace = direction > 0
                ? axisCenter - axisSize / 2
                : axisCenter + axisSize / 2;
            const distance = Math.max(
                0,
                (wallFace - direction * (halfSize + 0.02) - start) * direction
            );
            const stopPosition = start + direction * distance;

            if (distance < (stop - start) * direction) {
                stop = stopPosition;
            }
        });

        return stop === Infinity || stop === -Infinity ? start : stop;
    }

    prepareWarning(duration) {
        this.phase = 'warning';
        this.warningReady = false;
        this.blocked = false;
        this.speed = GAME_CONFIG.waves.warningDistanceUnits *
            GAME_CONFIG.unitPixels * 1000 / duration;
        this.hitbox.body.setVelocity(
            this.direction.x * this.speed,
            this.direction.y * this.speed
        );
    }

    move(phase, speed) {
        this.phase = phase;
        this.blocked = false;
        this.speed = speed;
        this.animationTime = 0;
        this.animationFrame = 0;
        this.sprite.setTexture('saw0');
        const sign = phase === 'extend' ? 1 : -1;
        this.hitbox.body.setVelocity(
            this.direction.x * sign * speed,
            this.direction.y * sign * speed
        );
    }

    update(delta) {
        this.updateAnimation(delta);

        if (this.phase === 'warning') {
            this.updateWarning(delta);
            return;
        }

        if (this.phase !== 'extend' && this.phase !== 'retract') {
            return;
        }

        if (this.blocked) {
            return;
        }

        const horizontal = this.direction.x !== 0;
        const sign = (horizontal ? this.direction.x : this.direction.y) *
            (this.phase === 'extend' ? 1 : -1);
        const current = horizontal ? this.hitbox.x : this.hitbox.y;
        const targetUnits = this.phase === 'extend'
            ? this.targetPosition
            : horizontal ? this.startX : this.startY;
        const remaining = (targetUnits * GAME_CONFIG.unitPixels - current) * sign;
        const stepDistance = this.speed * delta / 1000;

        if (remaining <= stepDistance) {
            const x = horizontal ? targetUnits * GAME_CONFIG.unitPixels : this.hitbox.x;
            const y = horizontal ? this.hitbox.y : targetUnits * GAME_CONFIG.unitPixels;
            this.hitbox.body.reset(x, y);
            this.stop();
            this.blocked = true;
            this.onBlocked(this);
        }
    }

    updateWarning(delta) {
        if (this.warningReady) {
            return;
        }

        const horizontal = this.direction.x !== 0;
        const sign = horizontal ? this.direction.x : this.direction.y;
        const current = horizontal ? this.hitbox.x : this.hitbox.y;
        const target = (
            (horizontal ? this.startX : this.startY) +
            sign * GAME_CONFIG.waves.warningDistanceUnits
        ) * GAME_CONFIG.unitPixels;
        const remaining = (target - current) * sign;
        const stepDistance = this.speed * delta / 1000;

        if (remaining <= stepDistance) {
            const x = horizontal ? target : this.hitbox.x;
            const y = horizontal ? this.hitbox.y : target;
            this.hitbox.body.reset(x, y);
            this.stop();
            this.warningReady = true;
            this.onWarningReady(this);
        }
    }

    updateAnimation(delta) {
        this.animationTime += delta;
        const frameDuration = GAME_CONFIG.saw.animationFrameDurationMs;
        const frame = Math.floor(this.animationTime / frameDuration) %
            GAME_CONFIG.saw.animationAssets.length;

        if (frame !== this.animationFrame) {
            this.animationFrame = frame;
            this.sprite.setTexture(`saw${frame}`);
        }
    }

    reset() {
        const x = this.startX * GAME_CONFIG.unitPixels;
        const y = this.startY * GAME_CONFIG.unitPixels;
        this.stop();
        this.hitbox.body.reset(x, y);
        this.phase = 'waiting';
        this.warningReady = false;
        this.blocked = false;
        this.animationTime = 0;
        this.animationFrame = 0;
        this.sprite.setTexture('saw0');
    }

    stop() {
        this.hitbox.body.setVelocity(0, 0);
    }

    damagePlayer(player) {
        if (this.phase !== 'extend' && this.phase !== 'retract') {
            return false;
        }

        return player.takeDamage();
    }

    getWorldObjects() {
        return [this.sprite, this.hitbox];
    }

    destroy() {
        this.scene.events.off('postupdate', this.onPostUpdate);
        if (this.playerOverlap && this.scene.physics.world) {
            this.scene.physics.world.removeCollider(this.playerOverlap);
        }
        this.sprite.destroy();
        this.hitbox.destroy();
    }
}
