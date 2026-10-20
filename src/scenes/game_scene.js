import Phaser from 'phaser';
import Player from '../entities/player.js';
import Wall from '../entities/wall.js';

const TAILLE_UNITE = 250;
const TAILLE_ARENE_EN_UNITES = 4;
const TAILLE_CAMERA_EN_UNITES = 6;
const EPAISSEUR_MUR_EN_UNITES = 1;
const COULEUR_MURS = 0xe76f51;

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    preload() {
        this.load.image('perso', 'assets/player.png');
    }

    create() {
        const largeurArene = TAILLE_ARENE_EN_UNITES * TAILLE_UNITE;
        const hauteurArene = TAILLE_ARENE_EN_UNITES * TAILLE_UNITE;
        const epaisseurMur = EPAISSEUR_MUR_EN_UNITES * TAILLE_UNITE;
        const largeurMursHorizontaux = largeurArene + 2 * epaisseurMur;
        const hauteurMursVerticaux = hauteurArene + 2 * epaisseurMur;
        const decalageMur = (TAILLE_ARENE_EN_UNITES / 2 + EPAISSEUR_MUR_EN_UNITES / 2) * TAILLE_UNITE;

        this.physics.world.setBounds(
            -(largeurMursHorizontaux / 2),
            -(hauteurArene / 2 + epaisseurMur),
            largeurMursHorizontaux,
            hauteurArene + 2 * epaisseurMur
        );

        this.player = new Player(this, 0, 0);
        this.murs = [
            new Wall(this, 0, -decalageMur, largeurMursHorizontaux, epaisseurMur, COULEUR_MURS),
            new Wall(this, 0, decalageMur, largeurMursHorizontaux, epaisseurMur, COULEUR_MURS),
            new Wall(this, -decalageMur, 0, epaisseurMur, hauteurMursVerticaux, COULEUR_MURS),
            new Wall(this, decalageMur, 0, epaisseurMur, hauteurMursVerticaux, COULEUR_MURS)
        ];

        this.murs.forEach(({ rectangle }) => {
            this.physics.add.collider(this.player.sprite, rectangle);
        });
        this.cameras.main.setBackgroundColor('#F4F1DE');
        this.cameras.main.setBackgroundColor('#F4F1DE');
        this.ajusterZoom();
        this.scale.on('resize', this.ajusterZoom, this);
    }

    ajusterZoom() {
        const tailleCamera = TAILLE_CAMERA_EN_UNITES * TAILLE_UNITE;
        const zoom = Math.min(this.scale.width, this.scale.height) / tailleCamera;

        this.cameras.main.setZoom(zoom);
        this.cameras.main.centerOn(0, 0);
    }

    update() {
        this.player.update();
    }
}