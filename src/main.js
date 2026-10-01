// main.js
import { Game } from './core/game.js';

// Instanciation de la session de jeu
const game = new Game();

// Lancement automatique au chargement
game.start();

// Exemple : lier facilement des contrôles extérieurs ou HTML
// Si la fenêtre perd le focus (onglet en arrière-plan), on peut suspendre le jeu :
window.addEventListener('blur', () => game.stop());
window.addEventListener('focus', () => game.start());

// Si tu as un bouton HTML dans ta page pour lancer/quitter :
// document.getElementById('btn-play').addEventListener('click', () => game.start());
// document.getElementById('btn-pause').addEventListener('click', () => game.stop());