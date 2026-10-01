// input.js
export const keys = { z: false, q: false, s: false, d: false };
export const keys_2 = { arrowup: false, arrowright: false, arrowdown: false, arrowleft: false};

// Remplacé par 'let' pour pouvoir écraser la valeur
export let zoom = 1; 

// Tes événements clavier existants
window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (keys.hasOwnProperty(key)) keys[key] = true;
    if (keys_2.hasOwnProperty(key)) keys_2[key] = true;
});

window.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (keys.hasOwnProperty(key)) keys[key] = false;
    if (keys_2.hasOwnProperty(key)) keys_2[key] = false;
});

// NOUVEAU : Événement pour la molette
window.addEventListener('wheel', (e) => {
    // e.deltaY est négatif (haut) ou positif (bas)
    if (e.deltaY < 0) {
        zoom *= 1.1; // Molette vers le haut : on zoom de 10%
    } else {
        zoom /= 1.1; // Molette vers le bas : on dézoom de 10%
    }

    // On "clamp" (limite) la valeur pour éviter de zoomer à l'infini ou d'inverser la caméra
    zoom = Math.max(0.2, Math.min(zoom, 5)); 
});