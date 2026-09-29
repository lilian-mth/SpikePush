import { ctx, layout } from '../core/display.js';
import { keys } from '../core/input.js';
import { joystick } from '../ui/joystick.js';

const CONFIG = {
    color: "#2a1b9d",
    sizeRatio: 0.25, // Prend 25% d'une case
    baseSpeed: 3
};

export const player = {
    x: 2.5,
    y: 2.5,
    speed: CONFIG.baseSpeed 
};

export function updatePlayer(dt) {
    let dx = 0;
    let dy = 0;

    if (joystick.active) {
        dx = joystick.dx;
        dy = joystick.dy;
    } else {
        if (keys.z) dy -= 1;
        if (keys.s) dy += 1;
        if (keys.q) dx -= 1;
        if (keys.d) dx += 1;

        if (dx !== 0 && dy !== 0) {
            const length = Math.sqrt(dx * dx + dy * dy); 
            dx /= length;
            dy /= length;
        }
    }

    player.x += dx * player.speed * dt;
    player.y += dy * player.speed * dt;

    if (player.x < 0) player.x = 0;
    if (player.x > layout.gridSize) player.x = layout.gridSize;
    if (player.y < 0) player.y = 0;
    if (player.y > layout.gridSize) player.y = layout.gridSize;
}

export function drawPlayer() {
    const pixelX = layout.offsetX + (player.x * layout.cellSize);
    const pixelY = layout.offsetY + (player.y * layout.cellSize);
    const radius = layout.cellSize * 0.25;

    ctx.fillStyle = "#3032ae"; 
    ctx.beginPath();
    ctx.arc(pixelX, pixelY, radius, 0, Math.PI * 2);
    ctx.fill();
}