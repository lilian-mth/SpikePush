const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 5; // Grille de 5x5
let cellSize = 0;
let gridOffsetX = 0;
let gridOffsetY = 0;

function resizeCanvas() {
    // 1. Taille de la fenêtre
    const width = window.innerWidth;
    const height = window.innerHeight;

    // 2. Gestion de la netteté (Device Pixel Ratio)
    const dpr = window.devicePixelRatio || 1;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    
    // On applique le scale pour ne plus se soucier du dpr dans nos calculs
    ctx.scale(dpr, dpr);

    // 3. Calcul de la grille dynamique (Méthode 1)
    // On prend 90% de la plus petite dimension pour laisser une marge
    const maxSquareSize = Math.min(width, height) * 0.90; 
    
    // Taille parfaite d'une cellule
    cellSize = maxSquareSize / gridSize;

    // 4. Centrage de la grille
    gridOffsetX = (width - maxSquareSize) / 2;
    
    // Astuce Mobile : Si le téléphone est à la verticale, on décale la grille vers le haut
    if (height > width) {
        gridOffsetY = (height - maxSquareSize) * 0.15; // 15% d'espace en haut, 85% en bas
    } else {
        gridOffsetY = (height - maxSquareSize) / 2; // Parfaitement centré sur PC
    }

    // 5. On redessine tout le jeu à la nouvelle taille
    drawGame();
}

function drawCell(gridX, gridY, color) {
    const pixelX = gridOffsetX + (gridX * cellSize);
    const pixelY = gridOffsetY + (gridY * cellSize);
    
    ctx.fillStyle = color;
    // On enlève 1 pixel pour créer une bordure naturelle entre les cellules
    ctx.fillRect(pixelX, pixelY, cellSize - 1, cellSize - 1); 
}

function drawGame() {
    // On efface le canvas avant de redessiner
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // Fond global de la zone de jeu (pour bien délimiter ton grand carré)
    ctx.fillStyle = "#313244";
    ctx.fillRect(gridOffsetX, gridOffsetY, cellSize * gridSize, cellSize * gridSize);

    // Double boucle pour dessiner les 25 cases
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            // Création d'un damier visuel pour le test
            const isEven = (x + y) % 2 === 0;
            const cellColor = isEven ? "#89b4fa" : "#cba6f7";
            
            drawCell(x, y, cellColor);
        }
    }

    // Simulation de l'UI sur mobile
    if (window.innerHeight > window.innerWidth) {
        ctx.fillStyle = "#a6e3a1";
        ctx.font = "bold 20px Arial";
        ctx.textAlign = "center";
        ctx.fillText("[ Zone Joystick & Boutons ]", window.innerWidth / 2, window.innerHeight - 80);
    }
}

// On écoute le redimensionnement de la fenêtre
window.addEventListener('resize', resizeCanvas);

// On lance le calcul une première fois au chargement
resizeCanvas();