// entities/rectangle.js
import { ctx } from '../core/display.js';

export class Rectangle {
    constructor(x, y, width, height, color = 'grey') {
        this.x = x; // Position X du CENTRE mathématique
        this.y = y; // Position Y du CENTRE mathématique
        this.width = width;
        this.height = height;
        this.color = color;
    }

    draw(camera) {
        const screenPos = camera.worldToScreen(this.x, this.y);
        const screenW = this.width * camera.zoomFactor;
        const screenH = this.height * camera.zoomFactor;

        ctx.fillStyle = this.color;
        // Le fillRect d'origine dessine depuis le coin supérieur gauche.
        // On soustrait la moitié de la taille pour dessiner à partir du centre.
        ctx.fillRect(
            screenPos.x - (screenW / 2), 
            screenPos.y - (screenH / 2), 
            screenW, 
            screenH
        );
    }
}