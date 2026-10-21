import Phaser from 'phaser';
import { GAME_CONFIG } from '../config/game_config.js';

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    create() {
        this.overlay = this.add.rectangle(
            0,
            0,
            this.scale.width,
            this.scale.height,
            0x000000,
            0.5
        ).setOrigin(0).setScrollFactor(0).setDepth(1);
        this.title = this.add.text(0, 0, GAME_CONFIG.ui.gameOver.label, {
            fontFamily: 'Arial, sans-serif',
            fontSize: '48px',
            fontStyle: 'bold',
            color: '#FFFFFF'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(2);

        this.homeButton = this.createButton(
            GAME_CONFIG.ui.gameOver.returnToMenuLabel,
            () => this.returnHome()
        );
        this.retryButton = this.createButton(
            GAME_CONFIG.ui.gameOver.retryLabel,
            () => this.retry()
        );

        this.scale.on('resize', this.layout, this);
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.scale.off('resize', this.layout, this);
        });
        this.layout();
    }

    createButton(label, callback) {
        const button = this.add.container(0, 0).setDepth(2).setScrollFactor(0);
        const background = this.add.rectangle(
            0,
            0,
            GAME_CONFIG.ui.gameOver.buttonWidth,
            GAME_CONFIG.ui.gameOver.buttonHeight,
            GAME_CONFIG.colors.homeButton
        ).setInteractive({ useHandCursor: true });
        const text = this.add.text(0, 0, label, {
            fontFamily: 'Arial, sans-serif',
            fontSize: '18px',
            fontStyle: 'bold',
            color: GAME_CONFIG.home.buttonTextColor
        }).setOrigin(0.5);

        background.on('pointerover', () =>
            background.setFillStyle(GAME_CONFIG.colors.homeButtonHover)
        );
        background.on('pointerout', () =>
            background.setFillStyle(GAME_CONFIG.colors.homeButton)
        );
        background.on('pointerdown', callback);
        button.add([background, text]);
        button.background = background;
        button.text = text;
        return button;
    }

    layout() {
        const pixelRatio = this.scale.width / this.sys.game.canvas.clientWidth;
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;

        this.overlay.setSize(this.scale.width, this.scale.height);
        this.title
            .setPosition(centerX, centerY - 95 * pixelRatio)
            .setFontSize(`${48 * pixelRatio}px`)
            .setResolution(pixelRatio);
        this.layoutButton(this.homeButton, centerX, centerY, pixelRatio, 0);
        this.layoutButton(this.retryButton, centerX, centerY, pixelRatio, 1);
    }

    layoutButton(button, centerX, centerY, pixelRatio, index) {
        button.setPosition(
            centerX,
            centerY + (index === 0 ? -5 : 75) * pixelRatio
        );
        button.background
            .setSize(
                GAME_CONFIG.ui.gameOver.buttonWidth * pixelRatio,
                GAME_CONFIG.ui.gameOver.buttonHeight * pixelRatio
            )
            .setInteractive({
                useHandCursor: true,
                hitArea: new Phaser.Geom.Rectangle(
                    0,
                    0,
                    GAME_CONFIG.ui.gameOver.buttonWidth * pixelRatio,
                    GAME_CONFIG.ui.gameOver.buttonHeight * pixelRatio
                ),
                hitAreaCallback: Phaser.Geom.Rectangle.Contains
            });
        button.text
            .setFontSize(`${18 * pixelRatio}px`)
            .setResolution(pixelRatio);
    }

    returnHome() {
        this.scene.stop('GameScene');
        this.scene.start('HomeScene');
    }

    retry() {
        this.scene.stop('GameScene');
        this.scene.start('GameScene');
    }
}
