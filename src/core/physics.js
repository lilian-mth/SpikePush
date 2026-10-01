// core/physics.js

/**
 * Résout la collision entre deux cercles dynamiques (ex: Joueur vs Joueur).
 * Reprend ta logique de math.js en l'adaptant pour des rayons potentiellement différents.
 */
export function resolveCircleCircle(c1, c2) {
    const dx = c2.x - c1.x; //[cite: 7]
    const dy = c2.y - c1.y; //[cite: 7]
    const distance = Math.sqrt(dx * dx + dy * dy); //[cite: 7]
    
    const sumRadii = c1.radius + c2.radius;

    // Pas de collision
    if (distance >= sumRadii) return false; 

    // Sécurité si les deux cercles sont exactement au même pixel[cite: 7]
    if (distance === 0) {
        c1.x -= 0.1; //[cite: 7]
        c2.x += 0.1; //[cite: 7]
        return true;
    }

    // Calcul du vecteur normal (direction)[cite: 7]
    const nx = dx / distance; 
    const ny = dy / distance; 
    
    // Calcul de la pénétration (la distance dont ils se chevauchent)
    const penetration = sumRadii - distance;
    // On divise par 2 car les deux sont dynamiques et se repoussent mutuellement
    const separation = penetration / 2;

    // Application de la résolution[cite: 7]
    c1.x -= nx * separation;
    c1.y -= ny * separation;
    c2.x += nx * separation;
    c2.y += ny * separation;

    return true; // Il y a eu une collision résolue
}

/**
 * Résout la collision entre un Cercle dynamique (Joueur) et un Rectangle statique (Mur).
 * On considère que rect.x et rect.y représentent le CENTRE du rectangle.
 */
export function resolveCircleRectangle(circle, rect) {
    const halfW = rect.width / 2;
    const halfH = rect.height / 2;

    // 1. Trouver le point du rectangle le plus proche du centre du cercle
    // On "clamp" (restreint) la position X et Y du cercle aux bords du rectangle
    const closestX = Math.max(rect.x - halfW, Math.min(circle.x, rect.x + halfW));
    const closestY = Math.max(rect.y - halfH, Math.min(circle.y, rect.y + halfH));

    // 2. Calculer la distance entre le centre du cercle et ce point le plus proche
    const dx = circle.x - closestX;
    const dy = circle.y - closestY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // 3. Vérifier s'il y a collision (si la distance est inférieure au rayon)
    if (distance < circle.radius) {
        
        // Cas extrême : le centre du cercle est rentré pile dans le rectangle
        if (distance === 0) {
            circle.y -= circle.radius; // On le repousse arbitrairement vers le haut
            return true;
        }

        const nx = dx / distance;
        const ny = dy / distance;
        const penetration = circle.radius - distance;

        // 4. Résolution : on repousse UNIQUEMENT le cercle (le rectangle est statique)
        circle.x += nx * penetration;
        circle.y += ny * penetration;
        
        return true;
    }

    return false;
}


// core/physics.js

export function resolveWorld(players, walls) {
    // 1. Résolution Joueurs vs Murs
    for (const player of players) {
        for (const wall of walls) {
            // CORRECTION : On passe directement 'wall' au lieu de 'wall.hitbox'
            resolveCircleRectangle(player.hitbox, wall);
        }
    }

    // 2. Résolution Joueurs vs Joueurs
    for (let i = 0; i < players.length; i++) {
        for (let j = i + 1; j < players.length; j++) {
            // Les joueurs utilisent la composition, donc on garde bien .hitbox
            resolveCircleCircle(players[i].hitbox, players[j].hitbox);
        }
    }
}