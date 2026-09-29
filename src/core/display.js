export const canvas = document.getElementById('gameCanvas');
export const ctx = canvas.getContext('2d');

// On stocke les dimensions dans un objet pour pouvoir les partager facilement
export const layout = {
    gridSize: 5,
    cellSize: 0,
    offsetX: 0,
    offsetY: 0
};

export function resizeCanvas() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;
    
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const maxSquareSize = Math.min(width, height) * 0.90;
    layout.cellSize = maxSquareSize / layout.gridSize;
    layout.offsetX = (width - maxSquareSize) / 2;
    
    if (height > width) {
        layout.offsetY = (height - maxSquareSize) * 0.15;
    } else {
        layout.offsetY = (height - maxSquareSize) / 2;
    }
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // Calcule la taille au démarrage