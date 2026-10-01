// core/display.js
export const canvas = document.getElementById('gameCanvas');
export const ctx = canvas.getContext('2d');

// Stocke les dimensions réelles de l'écran pour la caméra
export const screen = {
    width: 0,
    height: 0
};

export function resizeCanvas() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const dpr = window.devicePixelRatio || 1; // Maintien de ta logique de netteté[cite: 1]
    
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    
    ctx.scale(dpr, dpr);

    screen.width = width;
    screen.height = height;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();