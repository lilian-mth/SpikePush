import { GAME_CONFIG } from '../config/game_config.js';

export default class GameHud {
    constructor(scene, camera, lives) {
        this.scene = scene;
        this.camera = camera;
        const pixelRatio = this.getPixelRatio();
        this.livesText = scene.add.text(
            24 * pixelRatio,
            20 * pixelRatio,
            `${GAME_CONFIG.ui.hud.livesLabel} : ${lives}`,
            {
                fontFamily: 'Arial, sans-serif',
                fontSize: `${22 * pixelRatio}px`,
                fontStyle: 'bold',
                color: GAME_CONFIG.colors.homeText
            }
        ).setScrollFactor(0).setDepth(1000).setResolution(pixelRatio);
        this.objects = [this.livesText];
        this.layout();
    }

    setLives(lives) {
        this.livesText.setText(`${GAME_CONFIG.ui.hud.livesLabel} : ${lives}`);
    }

    layout() {
        const pixelRatio = this.getPixelRatio();
        this.camera.setSize(this.scene.scale.width, this.scene.scale.height);
        this.livesText.setPosition(24 * pixelRatio, 20 * pixelRatio);
    }

    getPixelRatio() {
        return this.scene.scale.width / this.scene.sys.game.canvas.clientWidth;
    }
}
