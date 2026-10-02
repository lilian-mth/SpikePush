// input.js
export const keys = { z: false, q: false, s: false, d: false };
export const keys_2 = { arrowup: false, arrowright: false, arrowdown: false, arrowleft: false};

// Remplacé par 'let' pour pouvoir écraser la valeur
export let zoom = 1; 

window.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (keys.hasOwnProperty(key)) keys[key] = false;
    if (keys_2.hasOwnProperty(key)) keys_2[key] = false;
});


window.addEventListener('keydown', (e) => {
    // Intercepte et annule le scroll pour les flèches et la barre espace
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault(); 
    }

    const key = e.key.toLowerCase();
    if (keys.hasOwnProperty(key)) keys[key] = true;
    if (keys_2.hasOwnProperty(key)) keys_2[key] = true;
});

// (L'événement keyup peut rester inchangé)

// Pour la molette, il faut ajouter l'option { passive: false } 
// sinon les navigateurs modernes interdisent le preventDefault()
window.addEventListener('wheel', (e) => {
    e.preventDefault(); // Coupe le défilement vertical de la page

    if (e.deltaY < 0) {
        zoom *= 1.1; 
    } else {
        zoom /= 1.1; 
    }

    zoom = Math.max(0.2, Math.min(zoom, 5)); 
}, { passive: false });