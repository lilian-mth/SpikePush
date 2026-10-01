import { ctx, gridToPixels, layout } from '../core/display.js';



function drawCell(gridX, gridY, color) {
    const pos = gridToPixels(gridX, gridY);
    
    ctx.fillStyle = color;
    ctx.fillRect(pos.x, pos.y, layout.cellSize - 1, layout.cellSize - 1); 
}

export function drawGame() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    ctx.fillStyle = "#313244";
    ctx.fillRect(layout.offsetX, layout.offsetY, layout.cellSize * layout.gridSize, layout.cellSize * layout.gridSize);

    for (let x = 0; x < layout.gridSize; x++) {
        for (let y = 0; y < layout.gridSize; y++) {
            drawCell(x, y, "#c4a484"); 
        }
    }
    /*
    if (window.innerHeight > window.innerWidth) {
        ctx.fillStyle = "#a6e3a1";
        ctx.font = "bold 20px Arial";
        ctx.textAlign = "center";
        ctx.fillText("[ Zone Joystick & Boutons ]", window.innerWidth / 2, window.innerHeight - 80);
    }
    */
}