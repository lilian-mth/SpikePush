// core/camera.js
import { screen } from './display.js';

export class Camera {
    constructor(x = 0, y = 0, captureHeight = 500) {
        // Position mathématique de la caméra (son centre)
        this.x = x; 
        this.y = y; 
        
        // C'est ce qui définit ton zoom. 
        // Si tu captures 500 unités, tu vois large (dézoom).
        // Si tu captures 100 unités, tu vois une petite zone de très près (zoom).
        this.baseCaptureHeight = captureHeight; 
        this.currentCaptureHeight = captureHeight;
        
        // Le multiplicateur de conversion Unités -> Pixels
        this.zoomFactor = 1; 
    }

    update() {
        // On recalcule le multiplicateur à chaque frame (ou à chaque redimensionnement)
        // Ratio = Taille de l'écran (pixels) / Taille capturée (unités)
        this.zoomFactor = screen.height / this.currentCaptureHeight;
    }

    worldToScreen(worldX, worldY) {
        // 1. Distance relative par rapport à la caméra
        const relX = worldX - this.x;
        
        // Note: On inverse relY (-relY) car dans le monde mathématique Y va vers le haut, 
        // mais sur un écran Y va vers le bas. Si tu fais un jeu vu de haut, 
        // tu n'es pas obligé de l'inverser, ça dépend de ta préférence.
        const relY = -(worldY - this.y); 

        // 2 & 3. Application du zoom et centrage sur l'écran
        return {
            x: (relX * this.zoomFactor) + (screen.width / 2),
            y: (relY * this.zoomFactor) + (screen.height / 2)
        };
    }

    // --- NOUVEAUX OUTILS ---

    // Déplace la caméra dans le monde mathématique
    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }

    // Téléporte la caméra à une coordonnée précise (pratique pour suivre un joueur)
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    // Modifie le niveau de zoom (ex: 2 = zoom x2, 0.5 = dézoom / vue éloignée)
    setZoomLevel(zoomMultiplier) {
        // On modifie la hauteur capturée en fonction du multiplicateur
        // Plus le diviseur est grand, plus la hauteur capturée est petite, plus on est zoomé.
        this.currentCaptureHeight = this.baseCaptureHeight / zoomMultiplier;
    }
}