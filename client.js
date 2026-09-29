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
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    ctx.fillStyle = "#313244"; // Fond global
    ctx.fillRect(gridOffsetX, gridOffsetY, cellSize * gridSize, cellSize * gridSize);

    // Dessin de la grille unie
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            drawCell(x, y, "#c4a484"); // Marron clair
        }
    }
}

const joystick = {
    active: false,
    baseX: 0,
    baseY: 0,
    stickX: 0,
    stickY: 0,
    maxRadius: 50, // Taille max de l'étirement du joystick
    dx: 0,
    dy: 0,
    touchId: null // Pour suivre le bon doigt si le joueur touche l'écran à 2 mains
};

// --- 1. ÉTAT DU JEU ET DU JOUEUR ---
const player = {
    x: 2.5, // Position logique (au centre de la grille 5x5)
    y: 2.5,
    speed: 3 // Vitesse : 4 cases par seconde
};

const keys = {
    z: false,
    q: false,
    s: false,
    d: false
};

// Écouteurs pour le clavier
window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (keys.hasOwnProperty(key)) keys[key] = true;
});

window.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (keys.hasOwnProperty(key)) keys[key] = false;
});

// --- 2. BOUCLE DE JEU (GAME LOOP) ---
let lastTime = 0;

function gameLoop(timestamp) {
    // Calcul du Delta Time (en secondes)
    // C'est le temps écoulé depuis la dernière frame. S'il y a un lag, le dt sera plus grand,
    // donc le joueur avancera plus pour compenser. Vitesse constante garantie.
    if (!lastTime) lastTime = timestamp;
    const dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    updateLogic(dt);
    drawGame(); // On efface et on dessine la grille (ta fonction existante)
    drawPlayer(); // On dessine le joueur par-dessus
    drawJoystick();

    // On rappelle la boucle pour la prochaine frame
    requestAnimationFrame(gameLoop);
}

// --- 3. MISE À JOUR DE LA LOGIQUE ---
function updateLogic(dt) {
    let dx = 0;
    let dy = 0;

    if (joystick.active) {
        // Le joystick contrôle
        dx = joystick.dx;
        dy = joystick.dy;
    } else {
        // Le clavier contrôle
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

    // Application du mouvement
    player.x += dx * player.speed * dt;
    player.y += dy * player.speed * dt;

    // Collisions avec les bords
    if (player.x < 0) player.x = 0;
    if (player.x > gridSize) player.x = gridSize;
    if (player.y < 0) player.y = 0;
    if (player.y > gridSize) player.y = gridSize;
}

// --- 4. AFFICHAGE DU JOUEUR ---
function drawPlayer() {
    const pixelX = gridOffsetX + (player.x * cellSize);
    const pixelY = gridOffsetY + (player.y * cellSize);
    
    // Le rayon est la moitié de la taille souhaitée (ici, 25% d'une case)
    const radius = cellSize * 0.25;

    ctx.fillStyle = "#3133a0"; 
    
    // On commence un nouveau tracé géométrique
    ctx.beginPath();
    // arc(x, y, rayon, angle_départ, angle_fin)
    ctx.arc(pixelX, pixelY, radius, 0, Math.PI * 2);
    ctx.fill(); // On remplit le cercle de couleur
}

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault(); 
    if (!joystick.active) {
        const touch = e.changedTouches[0];
        joystick.touchId = touch.identifier;
        joystick.active = true;
        // On place la base et le stick là où le doigt touche
        joystick.baseX = touch.clientX;
        joystick.baseY = touch.clientY;
        joystick.stickX = touch.clientX;
        joystick.stickY = touch.clientY;
        joystick.dx = 0;
        joystick.dy = 0;
    }
}, { passive: false });

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (joystick.active) {
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            // On vérifie que c'est bien le doigt du joystick qui bouge
            if (touch.identifier === joystick.touchId) {
                let diffX = touch.clientX - joystick.baseX;
                let diffY = touch.clientY - joystick.baseY;
                let distance = Math.sqrt(diffX * diffX + diffY * diffY);

                // On empêche le centre du joystick de sortir du cercle de base
                if (distance > joystick.maxRadius) {
                    diffX = (diffX / distance) * joystick.maxRadius;
                    diffY = (diffY / distance) * joystick.maxRadius;
                }

                joystick.stickX = joystick.baseX + diffX;
                joystick.stickY = joystick.baseY + diffY;

                // On génère une valeur entre -1 et 1 pour la vitesse
                joystick.dx = diffX / joystick.maxRadius;
                joystick.dy = diffY / joystick.maxRadius;
            }
        }
    }
}, { passive: false });

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === joystick.touchId) {
            joystick.active = false; // On relâche le joystick
            joystick.dx = 0;
            joystick.dy = 0;
        }
    }
}, { passive: false });

function drawJoystick() {
    if (!joystick.active) return; // On ne dessine rien si l'écran n'est pas touché

    // Le grand cercle de base (semi-transparent)
    ctx.beginPath();
    ctx.arc(joystick.baseX, joystick.baseY, joystick.maxRadius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    ctx.fill();

    // Le petit cercle central (celui qui suit le pouce)
    ctx.beginPath();
    ctx.arc(joystick.stickX, joystick.stickY, joystick.maxRadius / 2, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.fill();
}

// --- LANCEMENT ---
// Remplace le simple appel final "resizeCanvas();" par :
resizeCanvas();
requestAnimationFrame(gameLoop); // Démarre le moteur

// On écoute le redimensionnement de la fenêtre
window.addEventListener('resize', resizeCanvas);

// On lance le calcul une première fois au chargement
resizeCanvas();