// entities/staticSquare.js
import { ctx } from '../core/display.js';

export class StaticSquare {
    constructor(x, y, size, color = 'blue') {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
    }

    draw(camera) {
        const screenPos = camera.worldToScreen(this.x, this.y);
        
        // CORRECTION : Utilisation de camera.zoomFactor au lieu de camera.zoom
        const screenSize = this.size * camera.zoomFactor; 

        ctx.fillStyle = this.color;
        ctx.fillRect(
            screenPos.x - (screenSize / 2), 
            screenPos.y - (screenSize / 2), 
            screenSize, 
            screenSize
        );
    }
}