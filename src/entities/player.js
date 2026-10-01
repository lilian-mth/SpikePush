import { keys, keys_2 } from '../core/input.js';
import { Circle } from './circle.js'; // Import de la forme géométrique pure

export class Player {
    constructor(startX = 2.5, startY = 2.5, id = 2, color = 'red', locked = false) {
        this.id = id;
        this.x = startX;
        this.y = startY;
        this.speed = 3;
        this.sizeRatio = 0.25;
        this.locked = locked;
        
        // Composition : on crée la hitbox géométrique
        // On lui passe la couleur pour le mode Debug
        this.hitbox = new Circle(this.x, this.y, this.sizeRatio, color);
    }

    update(dt) {
        if (this.locked) return;
        let dx = 0;
        let dy = 0;

        // Dans un repère mathématique classique, l'axe Y pointe vers le HAUT.
        // Les touches sont donc inversées par rapport à un écran classique.
        
        if (keys.z) dy += 1;
        if (keys.s) dy -= 1;
        if (keys.q) dx -= 1;
        if (keys.d) dx += 1;

        if (dx !== 0 && dy !== 0) {
            const length = Math.sqrt(dx * dx + dy * dy);
            dx /= length;
            dy /= length;
        }

        // On applique le déplacement à la position du joueur
        this.x += dx * this.speed * dt;
        this.y += dy * this.speed * dt;

        // On transfère l'intention de mouvement à la hitbox avant la physique
        this.hitbox.x = this.x;
        this.hitbox.y = this.y;
    }

    syncFromPhysics() {
        // Après la résolution des collisions, la hitbox aura peut-être été repoussée.
        // Le joueur s'aligne sur la réalité physique.
        this.x = this.hitbox.x;
        this.y = this.hitbox.y;
    }

    draw(camera) {
        // En attendant d'avoir des sprites, on délègue le rendu visuel à la hitbox
        this.hitbox.draw(camera);
    }
}