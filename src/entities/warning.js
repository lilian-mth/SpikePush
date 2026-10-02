// entities/worldWarning.js
import { Circle } from './circle.js';

export class WorldWarning {
    constructor(x, y, maxRadius, color = 'rgba(255, 0, 0, 0.5)') {
        this.x = x;
        this.y = y;
        this.maxRadius = maxRadius;
        
        // On initialise le cercle avec un rayon de 0
        this.graphic = new Circle(this.x, this.y, 0, color);
        
        this.timer = 0;
        this.animationSpeed = 5;
        this.active = false;
    }

    update(dt) {
        if (!this.active) return;

        this.timer += dt * this.animationSpeed;
        
        // Fait pulser le rayon entre 0 et maxRadius en utilisant un sinus
        // Math.abs permet d'éviter un rayon négatif
        const currentRadius = Math.abs(Math.sin(this.timer)) * this.maxRadius;
        
        // On met à jour la taille de la primitive directement
        this.graphic.radius = currentRadius;
    }

    draw(camera) {
        if (!this.active) return;
        // L'affichage reste géré par la primitive Circle existante
        this.graphic.draw(camera);
    }
}