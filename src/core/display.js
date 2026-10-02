// core/display.js
export const canvas = document.getElementById('gameCanvas');
export const ctx = canvas.getContext('2d');

// Stocke les dimensions réelles de l'écran pour la caméra
export const screen = {
    width: 0,
    height: 0
};

export function resizeCanvas() {
    // clientWidth/clientHeight mesurent la zone interne réellement disponible, sans bordures ni marges
    const width = document.documentElement.clientWidth;
    const height = document.documentElement.clientHeight;
    const dpr = window.devicePixelRatio || 1;
    
    // Le fait d'assigner canvas.width réinitialise automatiquement le ctx.scale accumulé
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    
    ctx.scale(dpr, dpr);

    screen.width = width;
    screen.height = height;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();