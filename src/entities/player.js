

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
        if (!this.isAlive) return;
        this.x = this.hitbox.x;
        this.y = this.hitbox.y;
    }

    draw(camera) {
        if (!this.isAlive) return; // Un joueur mort ne s'affiche pas
        this.hitbox.draw(camera);
    }
}