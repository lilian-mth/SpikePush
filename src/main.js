// On importe les fichiers autonomes pour qu'ils s'exécutent (clavier et canvas)
import './core/display.js'; 
import './core/input.js';   

// On importe les fonctions spécifiques dont on a besoin pour la boucle
import { drawGame } from './entities/grid.js';
import { updatePlayer, drawPlayer } from './entities/player.js';
import { drawJoystick } from './ui/joystick.js';

let lastTime = 0;

function gameLoop(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    // 1. Mise à jour de la logique
    updatePlayer(dt);

    // 2. Affichage
    drawGame();
    drawPlayer();
    drawJoystick();

    // 3. Boucle
    requestAnimationFrame(gameLoop);
}

// Lancement du jeu
requestAnimationFrame(gameLoop);