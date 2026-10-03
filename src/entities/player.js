

import { Circle } from './circle.js';
import { keys, keys_2 } from '../core/input.js';

export class Player {
    constructor(startX, startY, color = 'red') {
        this.spawnX = startX; // On garde en mémoire sa case de départ
        this.spawnY = startY;
        this.x = startX;
        this.y = startY;
        this.speed = 3;
        this.hitbox = new Circle(this.x, this.y, 0.25, color);
        
        // Nouvel état
        this.isAlive = true;
    }

    die() {
        if (!this.isAlive) return; // Évite de mourir plusieurs fois par frame
        this.isAlive = false;
        console.log(`Joueur éliminé !`);
    }

    respawn() {
        this.isAlive = true;
        this.x = this.spawnX;
        this.y = this.spawnY;
        this.hitbox.x = this.x;
        this.hitbox.y = this.y;
    }

    update(dt) {
        let dx = 0; //[cite: 6]
        let dy = 0; //[cite: 6]
        
        // --- Clavier ---
        if (keys.z) dy += 1; //[cite: 6]
        if (keys.s) dy -= 1; //[cite: 6]
        if (keys.q) dx -= 1; //[cite: 6]
        if (keys.d) dx += 1; //[cite: 6]

        // --- Joystick ---
        if (joystick.active) {
            dx += joystick.dx;
            // On inverse dy car sur ton canvas Y descend, 
            // mais mathématiquement (comme le fait ta touche Z), Y monte.
            dy -= joystick.dy; 
        }

        // Normalisation (déjà dans ton code)[cite: 6]
        if (dx !== 0 && dy !== 0) {
            const length = Math.sqrt(dx * dx + dy * dy); //[cite: 6]
            dx /= length; //[cite: 6]
            dy /= length; //[cite: 6]
        }

        this.x += dx * this.speed * dt; //[cite: 6]
        this.y += dy * this.speed * dt; //[cite: 6]
        this.hitbox.x = this.x; //[cite: 6]
        this.hitbox.y = this.y; //[cite: 6]
    }

    syncFromPhysics() {
        if (!this.isAlive) return;
        this.x = this.hitbox.x;
        this.y = this.hitbox.y;
    }

    draw(camera) {
        if (!this.isAlive) return; // Un joueur mort ne s'affiche pas
        this.hitbox.draw(camera);
    }
}