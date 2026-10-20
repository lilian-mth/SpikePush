import Phaser from 'phaser';
import { GAME_CONFIG } from '../config/game_config.js';

export default class HomeScene extends Phaser.Scene {
    constructor() {
        super('HomeScene');
    }

    create() {
        this.cameras.main.setBackgroundColor(GAME_CONFIG.colors.background);

        this.title = this.add.text(0, 0, GAME_CONFIG.home.title, {
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold',
            color: GAME_CONFIG.colors.homeText
        }).setOrigin(0.5);

        this.subtitle = this.add.text(0, 0, GAME_CONFIG.home.subtitle, {
            fontFamily: 'Arial, sans-serif',
            color: GAME_CONFIG.colors.homeText,
            align: 'center',
            wordWrap: { width: 420 }
        }).setOrigin(0.5);

        this.playButton = this.add.rectangle(
            0,
            0,
            GAME_CONFIG.home.buttonWidth,
            GAME_CONFIG.home.buttonHeight,
            GAME_CONFIG.colors.homeButton
        ).setInteractive({ useHandCursor: true });

        this.playLabel = this.add.text(0, 0, GAME_CONFIG.home.playLabel, {
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold',
            color: GAME_CONFIG.home.buttonTextColor
        }).setOrigin(0.5);

        this.playButton.on('pointerover', () => {
            this.playButton.setFillStyle(GAME_CONFIG.colors.homeButtonHover);
        });
        this.playButton.on('pointerout', () => {
            this.playButton.setFillStyle(GAME_CONFIG.colors.homeButton);
        });
        this.playButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        this.scale.on('resize', this.layout, this);
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.scale.off('resize', this.layout, this);
        });
        this.layout();
    }

    layout() {
        const pixelRatio = this.scale.width / this.sys.game.canvas.clientWidth;
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;

        this.title
            .setFontSize(GAME_CONFIG.home.titleFontSize * pixelRatio)
            .setResolution(pixelRatio);
        this.subtitle
            .setFontSize(GAME_CONFIG.home.subtitleFontSize * pixelRatio)
            .setWordWrapWidth(420 * pixelRatio)
            .setResolution(pixelRatio);
        this.playLabel
            .setFontSize(GAME_CONFIG.home.buttonFontSize * pixelRatio)
            .setResolution(pixelRatio);
        this.playButton.setSize(
            GAME_CONFIG.home.buttonWidth * pixelRatio,
            GAME_CONFIG.home.buttonHeight * pixelRatio
        );
        this.title.setPosition(
            centerX,
            centerY + GAME_CONFIG.home.titleOffsetY * pixelRatio
        );
        this.subtitle.setPosition(
            centerX,
            centerY + GAME_CONFIG.home.subtitleOffsetY * pixelRatio
        );
        const buttonY = centerY + GAME_CONFIG.home.buttonOffsetY * pixelRatio;
        this.playButton.setPosition(centerX, buttonY);
        this.playLabel.setPosition(centerX, buttonY);
    }
}
