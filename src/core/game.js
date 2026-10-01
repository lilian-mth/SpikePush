// core/game.js
import { ctx, screen } from './display.js';
import { Camera } from './camera.js';
import { zoom } from './input.js';
import { Player } from '../entities/player.js';
import { Rectangle } from '../entities/rectangle.js';
import { resolveWorld } from './physics.js';

export class Game {
    constructor() {
        this.camera = new Camera(2, 2, 4.5);
        this.player1 = new Player(2.5, 2.5, 2, '#ff0044');
        this.walls = [
            // Bordures
            new Rectangle(2, -0.5, 6, 1, 'black'),
            new Rectangle(2, 4.5, 6, 1, 'black'),
            new Rectangle(-0.5, 2, 1, 4, 'black'),
            new Rectangle(4.5, 2, 1, 4, 'black'),
            // Blocs intérieurs
            new Rectangle(0.5, 3.5, 1, 1, 'gray'),
            new Rectangle(2.5, 1.5, 1, 1, 'gray')
        ];

        this.isRunning = false;
        this.lastTime = 0;
        this.animationFrameId = null;
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.lastTime = performance.now();
        // Bind pour conserver le contexte "this" dans requestAnimationFrame
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
        // 1. Intentions de déplacement
        this.player1.update(dt);

        // 2. Résolution physique
        resolveWorld([this.player1], this.walls);

        // 3. Synchronisation
        this.player1.syncFromPhysics();
    }

    render() {
        // Nettoyage et mise à jour de la vue
        ctx.clearRect(0, 0, screen.width, screen.height);
        this.camera.setZoomLevel(zoom);
        this.camera.update();

        // Rendu
        this.walls.forEach(wall => wall.draw(this.camera));
        this.player1.draw(this.camera);
    }
}