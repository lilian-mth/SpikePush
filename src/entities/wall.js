import { GAME_CONFIG } from '../config/game_config.js';

export default class Wall {
    constructor(scene, { x, y, width, height }, color = GAME_CONFIG.colors.walls) {
        const unit = GAME_CONFIG.unitPixels;
        this.rectangle = scene.add.rectangle(
            x * unit,
            y * unit,
            width * unit,
            height * unit,
            color
        );
        scene.physics.add.existing(this.rectangle, true);
    }
}
