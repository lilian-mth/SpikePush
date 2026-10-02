// core/game.js
import { ctx, screen } from './display.js';
import { Camera } from './camera.js';
import { zoom } from './input.js';
import { Player } from '../entities/player.js';
import { Rectangle } from '../entities/rectangle.js';
import { Spike } from '../entities/spike.js';
import {
    resolveCircleRectangle,
    isOverlappingCircleRect,
    resolveRectRect
} from './physics.js';
import { WorldWarning } from '../entities/warning.js';

export class Game {
    constructor() {
        this.camera = new Camera(2, 2, 6);
        this.player1 = new Player(3.5, 3.5, '#ff0044');
        this.boundaries = [
            new Rectangle(2, -0.5, 6, 1, 'black'),
            new Rectangle(2, 4.5, 6, 1, 'black'),
            new Rectangle(-0.5, 2, 1, 4, 'black'),
            new Rectangle(4.5, 2, 1, 4, 'black'),
        ];
        this.interiorWalls = [
            new Rectangle(0.5, 3.5, 1, 1, 'gray'),
            new Rectangle(2.5, 1.5, 1, 1, 'gray')
        ];
        this.spikes = {
            'UP' : [
                new Spike(0.5, 6, 1, 4, 0, -1, 10),
                new Spike(1.5, 6, 1, 4, 0, -1, 10),
                new Spike(2.5, 6, 1, 4, 0, -1, 10),
                new Spike(3.5, 6, 1, 4, 0, -1, 10),
            ],
            'DOWN' : [
                new Spike(0.5, -2, 1, 4, 0, 1, 10),
                new Spike(1.5, -2, 1, 4, 0, 1, 10),
                new Spike(2.5, -2, 1, 4, 0, 1, 10),
                new Spike(3.5, -2, 1, 4, 0, 1, 10),
            ],
            'RIGHT' : [
                new Spike(6, 0.5, 4, 1, -1, 0, 10),
                new Spike(6, 1.5, 4, 1, -1, 0, 10),
                new Spike(6, 2.5, 4, 1, -1, 0, 10),
                new Spike(6, 3.5, 4, 1, -1, 0, 10),
            ],
            'LEFT' : [
                new Spike(-2, 0.5, 4, 1, 1, 0, 10),
                new Spike(-2, 1.5, 4, 1, 1, 0, 10),
                new Spike(-2, 2.5, 4, 1, 1, 0, 10),
                new Spike(-2, 3.5, 4, 1, 1, 0, 10),
            ]
        };
        
        this.warnings = {
            'UP' : [
                new WorldWarning(0.5, 4.5, 0.7, 'red'),
                new WorldWarning(1.5, 4.5, 0.7, 'red'),
                new WorldWarning(2.5, 4.5, 0.7, 'red'),
                new WorldWarning(3.5, 4.5, 0.7, 'red'),
            ],
            'DOWN' : [
                new WorldWarning(0.5, -0.5, 0.7, 'red'),
                new WorldWarning(1.5, -0.5, 0.7, 'red'),
                new WorldWarning(2.5, -0.5, 0.7, 'red'),
                new WorldWarning(3.5, -0.5, 0.7, 'red'),
            ],
            'RIGHT': [
                new WorldWarning(4.5, 0.5, 0.7, 'red'),
                new WorldWarning(4.5, 1.5, 0.7, 'red'),
                new WorldWarning(4.5, 2.5, 0.7, 'red'),
                new WorldWarning(4.5, 3.5, 0.7, 'red'),
            ],
            'LEFT': [
                new WorldWarning(-0.5, 0.5, 0.7, 'red'),
                new WorldWarning(-0.5, 1.5, 0.7, 'red'),
                new WorldWarning(-0.5, 2.5, 0.7, 'red'),
                new WorldWarning(-0.5, 3.5, 0.7, 'red'),
            ]
        };

        this.isRunning = false;
        this.lastTime = 0;
        this.animationFrameId = null;
        this.waveState = 'WAITING_ATTACK'; 
        this.waveTimer = 3.0; 
        this.warningTime = 2;
        this.side = null;
        this.isWarningActive = false; // Permet de ne tirer au sort le côté qu'une seule fois
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.lastTime = performance.now();
        this.loop = this.loop.bind(this);
        this.animationFrameId = requestAnimationFrame(this.loop);
    }

    stop() {
        this.isRunning = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    loop(timestamp) {
        if (!this.isRunning) return;

        const dt = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        this.update(dt);
        this.render();

        this.animationFrameId = requestAnimationFrame(this.loop);
    }

    update(dt) {
        // --- 1. GESTION DU CYCLE DE JEU ---
        if (this.waveState === 'WAITING_ATTACK' || this.waveState === 'WAITING_RETRACT') {
            this.waveTimer -= dt; 
        }

        // Respawn du joueur au tout début du cycle
        if (this.waveState === 'WAITING_ATTACK' && this.waveTimer >= 2.9) {
            if (!this.player1.isAlive) {
                this.player1.respawn();
            }
        }

        // Déclenchement du warning
        if (this.waveState === 'WAITING_ATTACK' && this.waveTimer <= this.warningTime) {
            // On ne choisit le côté qu'une seule fois par attaque
            if (!this.isWarningActive) {
                const sides = ['UP', 'DOWN', 'RIGHT', 'LEFT'];
                this.side = sides[Math.floor(Math.random() * sides.length)];
                this.isWarningActive = true;
                
                this.warnings[this.side].forEach(warning => warning.active = true);
            }
            
            // Mise à jour de l'animation de pulsation des warnings
            this.warnings[this.side].forEach(warning => warning.update(dt));
        }

        // Phase A : Lancement de l'attaque
        if (this.waveState === 'WAITING_ATTACK' && this.waveTimer <= 0) {
            this.warnings[this.side].forEach(warning => warning.active = false);
            this.isWarningActive = false; // Reset pour la prochaine vague

            // On lance uniquement les pics du côté choisi
            this.spikes[this.side].forEach(spike => spike.attack());
            this.waveState = 'ATTACKING';
        }

        // Phase B : Vérifier si l'attaque est finie
        if (this.waveState === 'ATTACKING') {
            // On vérifie uniquement les pics du côté attaquant
            const allStopped = this.spikes[this.side].every(s => s.state === 'IDLE');
            if (allStopped) {
                this.waveTimer = 3.0;
                this.waveState = 'WAITING_RETRACT';
            }
        }

        // Phase C : Rétractation
        if (this.waveState === 'WAITING_RETRACT' && this.waveTimer <= 0) {
            // On rétracte uniquement le côté qui a attaqué
            this.spikes[this.side].forEach(spike => spike.retract());
            this.waveState = 'RETRACTING';
        }

        // Phase D : Vérifier si la rétractation est finie pour boucler
        if (this.waveState === 'RETRACTING') {
            const allStopped = this.spikes[this.side].every(s => s.state === 'IDLE');
            if (allStopped) {
                this.waveTimer = 3.0;
                this.waveState = 'WAITING_ATTACK'; // La boucle recommence !
                this.side = null;
            }
        }

        // --- 2. DÉPLACEMENT DES ENTITÉS ---
        this.player1.update(dt);
        
        // On récupère tous les pics d'un coup dans un seul tableau plat pour les updates et collisions
        const allSpikes = Object.values(this.spikes).flat();
        allSpikes.forEach(spike => spike.update(dt));

        // --- 3. MASQUE SPIKE VS MURS INTERIEURS ---
        for (const spike of allSpikes) {
            if (spike.state === 'ATTACKING') {
                for (const wall of this.interiorWalls) {
                    if (resolveRectRect(spike.hitbox, wall)) {
                        spike.x = spike.hitbox.x;
                        spike.y = spike.hitbox.y;
                        spike.stop();
                        break;
                    }
                }
            }
        }

        // --- 4. MASQUE JOUEUR VS MURS ---
        const allWalls = [...this.boundaries, ...this.interiorWalls];
        for (const wall of allWalls) {
            resolveCircleRectangle(this.player1.hitbox, wall);
        }

        // --- 5. MASQUE SPIKE VS JOUEUR ---
        if (this.player1.isAlive) {
            for (const spike of allSpikes) {
                if (isOverlappingCircleRect(this.player1.hitbox, spike.hitbox)) {
                    this.player1.die();
                }
            }
        }

        // --- 6. SYNCHRO ---
        this.player1.syncFromPhysics();
    }

    render() {
        ctx.clearRect(0, 0, screen.width, screen.height);
        this.camera.setZoomLevel(zoom);
        this.camera.update();

        this.boundaries.forEach(wall => wall.draw(this.camera));
        this.interiorWalls.forEach(wall => wall.draw(this.camera));
        
        // Affichage de tous les pics
        Object.values(this.spikes).flat().forEach(spike => spike.draw(this.camera));
        
        this.player1.draw(this.camera);

        // Affichage des warnings actifs
        if (this.side && this.isWarningActive) {
            this.warnings[this.side].forEach(warning => {
                if (warning.active) warning.draw(this.camera);
            });
        }
    }
}