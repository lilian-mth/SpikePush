// entities/circle.js
import { ctx } from '../core/display.js';

export class Circle {
    constructor(x, y, radius, color = 'blue') {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    draw(camera) {
        const screenPos = camera.worldToScreen(this.x, this.y);
        const screenRadius = this.radius * camera.zoomFactor;

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(screenPos.x, screenPos.y, screenRadius, 0, Math.PI * 2);
        ctx.fill();
    }
}