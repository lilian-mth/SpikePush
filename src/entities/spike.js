// entities/spike.js
import { Rectangle } from './rectangle.js';

export class Spike {
    constructor(x, y, width, height, dirX, dirY, speed = 10) {
        this.startX = x;
        this.startY = y;
        this.x = x;
        this.y = y;
        this.dirX = dirX;
        this.dirY = dirY;
        this.speed = speed;
        this.maxDistance = 4; // Distance maximale de déplacement
        
        this.hitbox = new Rectangle(this.x, this.y, width, height, 'orange');
        
        // États possibles : 'IDLE', 'ATTACKING', 'RETRACTING'
        this.state = 'IDLE'; 
    }

    attack() {
        this.state = 'ATTACKING';
    }

    retract() {
        this.state = 'RETRACTING';
    }

    stop() {
        this.state = 'IDLE';
    }

    update(dt) {
        if (this.state === 'IDLE') return;

        const step = this.speed * dt;

        if (this.state === 'ATTACKING') {
            // 1. On calcule la future position virtuelle
            let nextX = this.x + (this.dirX * step);
            let nextY = this.y + (this.dirY * step);
            
            // 2. On vérifie la distance de cette future position
            const dist = Math.hypot(nextX - this.startX, nextY - this.startY);
            
            // 3. Si le prochain saut nous fait dépasser la limite...
            if (dist >= this.maxDistance) {
                // ... on aimante le pic pile poil sur sa distance max mathématique
                this.x = this.startX + (this.dirX * this.maxDistance);
                this.y = this.startY + (this.dirY * this.maxDistance);
                this.stop();
            } else {
                // Sinon, on applique le mouvement normalement
                this.x = nextX;
                this.y = nextY;
            }
        } 
        else if (this.state === 'RETRACTING') {
            const distToStart = Math.hypot(this.x - this.startX, this.y - this.startY);
            
            // Même principe pour le retour : si on est sur le point de dépasser le point de départ
            if (distToStart <= step) {
                this.x = this.startX;
                this.y = this.startY;
                this.stop();
            } else {
                this.x -= this.dirX * step;
                this.y -= this.dirY * step;
            }
        }

        // On synchronise la hitbox avec la position corrigée
        this.hitbox.x = this.x;
        this.hitbox.y = this.y;
    }

    draw(camera) {
        this.hitbox.draw(camera);
    }
}