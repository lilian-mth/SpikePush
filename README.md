# SpikePush

SpikePush est un jeu d'arène en vue de dessus, conçu pour navigateur. Le concept est une partie de survie : les joueurs esquivent des rondins qui traversent l'arène et des murs intérieurs mobiles.

> **État du projet :** le prototype local comprend le menu, l'arène, un joueur, des rondins, des vagues WallShift et trois vies. Le multijoueur reste à développer.

## Concept et règles prévues

- Une salle accueille plusieurs joueurs, par exemple quatre.
- Chaque joueur commence avec trois vies.
- Un seul côté complet est attaqué à la fois : les quatre pointes du côté sélectionné traversent l'arène depuis le nord, le sud, l'est ou l'ouest.
- Les bandes de bordure sont jaunes au repos ; celle du côté attaqué clignote en rouge pendant l'avertissement. Lors d'une vague WallShift, les quatre bandes clignotent.
- Les rondins avancent à vitesse constante et s'arrêtent devant les murs intérieurs, sans écraser les cases protégées derrière ces murs. Après une courte pause, ils repartent vers leur bord d'origine.
- Seize pointes restent à leur taille normale à l'extérieur de l'arène ; les quatre pointes du côté choisi sont celles qui se déplacent, sans doublon. Les limites invisibles empêchent le joueur de sortir.
- Si `firstHitConsumesWave` est activé, le premier rondin qui touche un joueur lui retire une vie et désactive les dégâts des rondins. La vague continue jusqu'au retour de tous les rondins.
- Toutes les `wallShiftEveryNWaves` vagues, un mur intérieur se déplace en ligne droite vers une case libre ; la translation garde une durée fixe.
- Le dernier joueur encore en vie remporte la partie.
- Le prototype dispose d'un joystick virtuel sur les appareils tactiles. Les commandes clavier restent disponibles sur ordinateur.
- Une capacité de dash ou de poussée est envisagée, mais ses règles restent à définir.

Le prototype gère déjà les vagues, les avertissements et les vies pour un joueur. Le multijoueur, la victoire du dernier survivant et le dash restent à développer.

## Prototype actuel

- Une arène carrée de **4 × 4 unités**.
- Des limites invisibles empêchent de sortir de l'arène ; les bandes d'alerte et les pointes forment son contour visuel.
- Une caméra centrée qui cadre l'arène et les pointes en attente.
- Un joueur dans la case en bas à gauche, contrôlable au clavier avec les **flèches** ou **ZQSD**.
- Un joystick virtuel tactile dynamique, qui apparaît sous le doigt partout sur l'écran de jeu.
- Un écran d'accueil avec un bouton **JOUER** pour lancer la partie.
- Deux murs intérieurs solides de **1 × 1 unité**.
- Quatre rondins massifs par attaque, un par voie, depuis un seul côté à la fois.
- Des avertissements lumineux jaunes au bord de l'arène, qui clignotent en rouge avant chaque vague.
- Des vagues WallShift périodiques où un mur intérieur se déplace vers une case libre alignée.
- Trois vies et un écran de fin affiché après la vague où la dernière vie est perdue, avec un retour au menu.
- Après un impact de rondin, le joueur reste immobilisé jusqu'à la fin de la vague et reprend au même endroit si des vies lui restent. Après un écrasement par WallShift, il réapparaît sur une case libre une fois le mur arrivé.
- Déplacement diagonal normalisé pour conserver la même vitesse dans toutes les directions.
- Le jeu occupe toute la fenêtre et la caméra s'adapte au ratio de l'écran.

Le multijoueur et la condition de victoire « dernier survivant » ne sont pas encore implémentés.

## Échelle et dimensions

Les positions et dimensions Phaser sont exprimées en pixels du monde. Pour raisonner plus simplement, le projet définit une unité de jeu :

| Élément | Dimensions |
| --- | ---: |
| 1 unité (U) | 250 pixels du monde |
| Zone jouable | 4 × 4 U, soit 1 000 × 1 000 pixels |
| Chaque mur | 1 U d'épaisseur |
| Vue de référence de la caméra | 6 × 6 U, soit 1 500 × 1 500 pixels |
| Diamètre du joueur | 0,45 U, soit 112,5 pixels du monde |
| Vitesse du joueur | 625 pixels/s, soit 2,5 U/s |
| Rondin | 1 U de large et au moins 5 U de long |

Les murs ont une longueur de 6 U sur leur côté extérieur. Ils se rejoignent aux coins afin de fermer complètement l'arène. Les coins font partie de l'épaisseur des murs, ils ne réduisent donc pas la zone intérieure de 4 × 4 U.

Le canvas occupe tout l'écran et conserve le ratio de l'appareil. La caméra ajuste son zoom pour montrer l'arène complète de 6 × 6 U, avec davantage de fond visible sur le côté le plus large. Le fond est crème (`#F4F1DE`) et les murs sont corail (`#E76F51`).

### Taille de l'image du joueur

Le joueur est actuellement un cercle vectoriel généré par Phaser, de **0,45 U de diamètre** (112,5 pixels du monde). Sa hitbox circulaire a exactement le même rayon que le cercle dessiné, ce qui évite un décalage visuel entre le joueur et ses collisions. Le paramètre `player.diameterUnits` permet de modifier ensemble la taille visible et la taille de collision. Le fichier `public/assets/player.png` n'est pas utilisé par ce cercle.

## Lancer le projet

Prérequis : une version de Node.js prise en charge par Vite 8.

```bash
npm install
npm run dev
```

Vite affiche l'adresse locale à ouvrir dans le navigateur. Pour vérifier la compilation de production :

```bash
npm run build
```

Pour servir le résultat compilé localement :

```bash
npm run preview
```

## Organisation du code

```text
index.html                  Page d'entrée et conteneur du jeu
style.css                   Fond global et cadrage carré de la fenêtre
src/main.js                 Configuration et démarrage de Phaser
src/config/game_config.js   Réglages du jeu : tailles, couleurs, positions et contrôles
src/scenes/home_scene.js    Écran d'accueil et bouton de lancement
src/scenes/game_scene.js    Arène, collisions, vagues et caméra
src/scenes/game_over_scene.js Écran de fin en surimpression et boutons
src/entities/game_hud.js     Affichage des vies
src/entities/player.js      Cercle du joueur, hitbox, contrôles et vitesse
src/entities/wall.js        Mur solide et mise à jour de sa hitbox
src/entities/log_trap.js    Rondin de voie, déplacement et collision
src/entities/border_warning.js Alerte lumineuse des bordures
src/entities/wall_shift.js  Déplacement aligné d'un mur intérieur
src/entities/virtual_joystick.js Joystick tactile et entrée directionnelle
public/assets/spike.png    Sprite horizontal du rondin
public/assets/player.png    Ancienne image du joueur (le prototype utilise un cercle vectoriel)
```

## Modifier les paramètres du jeu

Les réglages de gameplay et de présentation sont regroupés dans `src/config/game_config.js`, dans l'objet `GAME_CONFIG` :

- `unitPixels`, `gridSize` et `camera` règlent l'échelle, la taille de la grille et le cadrage.
- `colors` regroupe le fond, les murs, le menu et le joystick ; `warningLights` configure les couleurs et le clignotement des alertes.
- `player.startPositions` contient les positions de départ en unités, relatives au centre de l'arène. Pour l'instant, seul le premier départ est utilisé puisque le prototype n'a qu'un joueur. La position `(-1.5, 1.5)` correspond au centre de la case en bas à gauche d'une arène de 4 × 4 U.
- `player.diameterUnits`, `speedUnitsPerSecond` et `lives` règlent la taille, le mouvement et le nombre de vies du joueur. La hitbox circulaire est alignée sur le diamètre visible.
- `walls.thickness` règle l'épaisseur des murs extérieurs. `walls.internal` contient les cases initiales des murs intérieurs, déplaçables par WallShift.
- `warningDuration` est la durée d'alerte en secondes ; `warningLights` règle les couleurs jaune au repos et rouge à l'alerte, l'épaisseur des bandes et le rythme de clignotement.
- Les 16 pointes utilisent la configuration `spike` : elles mesurent 6 × 0,8 U. Les pointes d'attaque se déplacent rapidement ; leur zone de dégâts est limitée à leur extrémité (0,4 × 0,8 U), et leur vitesse de rétraction est réglée séparément, plus lentement.
- Chaque pointe possède une box solide sur toute sa longueur, séparée du capteur de dégâts à l'extrémité : le joueur est bloqué par la pointe sans subir de dégâts au contact de son corps.
- `spike.attackSpeedUnitsPerSecond`, `spike.retractSpeedUnitsPerSecond`, `spike.depth`, `player.depth` et `warningLights.depth` règlent les vitesses d'attaque/rétraction et l'ordre d'affichage. Le warning est dessiné sous les pointes, et le joueur au-dessus.
- `wallMoveDuration` est la durée fixe de déplacement d'un mur, en secondes. `waves.wallShiftEveryNWaves` règle la fréquence des vagues WallShift, `waves.targetPauseMs` la pause des pointes à leur point d'arrêt et `waves.betweenWavesMs` la pause entre les vagues.
- `firstHitConsumesWave` désactive les dégâts des rondins après le premier impact. Les rondins terminent leur course, attendent puis se rétractent normalement.
- `ui.hud` et `ui.gameOver` regroupent les textes et dimensions de l'interface, indépendamment des paramètres des pièges ou du joueur.
- `debug.enabled` active le rendu des corps Arcade Physics pour visualiser les hitboxes. Les couleurs des corps mobiles, des murs statiques et des vecteurs de vitesse se règlent avec `debug.bodyColor`, `debug.staticBodyColor` et `debug.velocityColor`.
- `joystick` règle la taille, la zone morte et l'apparence grise du joystick tactile. Le joystick peut apparaître à n'importe quel endroit du canvas.
- `home` règle les textes, les tailles de police, la position et les dimensions du bouton de l'écran d'accueil.

Les murs intérieurs sont positionnés par leur centre. L'axe X positif va vers la droite, et l'axe Y positif vers le bas. Les dimensions et positions du joueur et des murs sont converties en pixels Phaser avec `unitPixels`.

## Phaser : les fonctions importantes

Phaser est le moteur de jeu JavaScript utilisé ici pour afficher le canvas, lire les contrôles et gérer les collisions.

### Démarrage — `src/main.js`

- `new Phaser.Game(config)` crée et démarre le jeu.
- `type: Phaser.AUTO` laisse Phaser choisir le moteur de rendu disponible, WebGL ou Canvas.
- `parent: 'game-container'` place le canvas dans l'élément HTML correspondant.
- `Phaser.Scale.FIT` conserve la résolution interne haute définition et ajuste son affichage au conteneur plein écran, au ratio de l'appareil.
- La résolution interne suit la largeur et la hauteur du viewport ainsi que la densité de pixels, plafonnée à 2× pour préserver les performances. Elle est actualisée quand la fenêtre change de taille.
- `antialias: true`, `pixelArt: false` et `roundPixels: false` privilégient un rendu lissé, adapté aux illustrations non pixel art.
- `physics.default: 'arcade'` active Arcade Physics, le système de collisions 2D simple de Phaser.
- `scene: [HomeScene, GameScene, GameOverScene]` enregistre les scènes dans le jeu et lance d'abord `HomeScene`.

### Écran d'accueil — `src/scenes/home_scene.js`

- `HomeScene` hérite de `Phaser.Scene` et reçoit la clé `HomeScene`.
- `create()` crée le titre, le sous-titre, le bouton et son texte.
- `setInteractive()` permet au rectangle du bouton de recevoir les événements de pointeur, souris ou tactile.
- `pointerover`, `pointerout` et `pointerdown` gèrent le survol, l'apparence du bouton et le démarrage de la partie.
- `this.scene.start('GameScene')` arrête l'écran d'accueil et démarre la scène de jeu.
- `layout()` centre les éléments ; l'événement `resize` la rappelle lorsque le canvas change de taille.

### Scène — `src/scenes/game_scene.js`

Une scène Phaser organise une partie ou un écran du jeu. Phaser appelle ses méthodes dans cet ordre :

1. `create()` construit le monde : limites physiques, joueur, murs, collisions, HUD, alertes et caméra.
2. `update()` actualise le joueur et les rondins en mouvement.
- Quand le joueur n'a plus de vies, `GameScene` se met en pause et lance `GameOverScene` au-dessus d'elle.

Autres appels Phaser utilisés dans la scène :

- `this.physics.world.setBounds(x, y, width, height)` définit les limites du monde physique.
- `this.physics.add.collider(a, b)` empêche deux objets physiques de se traverser.
- `this.cameras.main.setBackgroundColor(color)` règle le fond visible par la caméra.
- `centerOn(x, y)` centre la vue sur une position du monde.
- `setZoom(zoom)` règle le rapport entre les pixels du monde et ceux de l'écran.
- `this.scale.on('resize', ...)` rappelle `ajusterZoom()` lorsque la taille du jeu change.

### Joueur — `src/entities/player.js`

- `scene.add.circle(x, y, radius, color)` dessine le joueur comme une forme vectorielle ; `scene.physics.add.existing(circle)` lui ajoute un corps Arcade Physics et `body.setCircle(radius)` aligne sa hitbox sur son dessin.
- `body.setCollideWorldBounds(true)` active la collision avec les limites du monde.
- `createCursorKeys()` lit les flèches ; `addKeys('Z,Q,S,D')` lit les touches ZQSD.
- `body.setVelocity(x, y)` applique la vitesse du joueur en pixels par seconde.
- La norme du vecteur de déplacement limite sa longueur à 1, pour conserver la même vitesse dans toutes les directions.
- `takeDamage()` retire une vie au contact d'un rondin ou d'un mur en translation ; le corps du joueur est désactivé pendant le reste de la vague.

### Murs — `src/entities/wall.js`

- `scene.add.rectangle(x, y, width, height, color)` dessine le rectangle du mur.
- `scene.physics.add.existing(rectangle, true)` ajoute un corps Arcade statique : il ne bouge pas sous l'effet de la physique et peut bloquer le joueur.

### Joystick — `src/entities/virtual_joystick.js`

- Le joystick n'est créé que si Phaser détecte un appareil tactile.
- Le canvas couvre tout le viewport : au toucher n'importe où sur l'écran, la base apparaît à la position touchée ou au bord le plus proche du canvas. Le joystick suit le doigt et se masque lorsqu'il est relâché.
- Une caméra HUD séparée garde le joystick et l'interface à taille constante à l'écran malgré le zoom de la caméra du jeu.
- Les événements pointeur capturés sur toute la fenêtre suivent le doigt. Le stick renvoie une direction normalisée `x`/`y` que le joueur ajoute à ses contrôles clavier.
- `pointerup`, `pointercancel` et la fermeture de la scène libèrent le joystick et ses écouteurs.

### Rondins et alertes — `src/entities/log_trap.js` et `src/entities/border_warning.js`

- Une vague normale choisit un seul côté et déplace les quatre pointes de ce côté. Chaque pointe mesure 6 × 0,8 U et traverse la grille jusqu'à ce que son avant atteigne le bord opposé.
- La trajectoire de chaque rondin est calculée selon sa voie ; le premier mur intérieur dans le sens d'entrée bloque le rondin et protège les cases situées derrière.
- `BorderWarning` affiche quatre bandes de 0,25 case au niveau du bord ; elles sont jaunes au repos et la bande choisie clignote en rouge pendant `warningDuration`. Il gère ses propres tween et timer.
- `SpikeIndicators` affiche les 16 pointes disponibles des quatre côtés et fournit leurs sprites aux attaques, sans créer de doublons. Une box solide couvre chaque pointe ; un capteur distinct de 0,4 × 0,8 U à l'extrémité déclenche les dégâts. Après le premier impact d'une vague, les dégâts sont désactivés, mais les pointes terminent leur course, attendent puis se rétractent plus lentement.
- Après le déplacement, les rondins attendent `targetPauseMs`, repartent vers leur bord d'origine, puis la vague suivante démarre après `betweenWavesMs`.
- Quand `firstHitConsumesWave` est activé, le premier contact coûte une vie et désactive les collisions de dégâts des rondins ; ils finissent leur course, marquent la pause puis se rétractent normalement.

### WallShift — `src/entities/wall_shift.js`

- Toutes les `waves.wallShiftEveryNWaves` vagues, un mur intérieur est choisi et déplacé vers une case libre de sa ligne ou de sa colonne ; les quatre bandes de warning clignotent pendant l'annonce.
- Le déplacement est linéaire et dure toujours `wallMoveDuration`, quelle que soit sa distance. Le corps physique statique du mur suit le tween pour conserver les collisions avec le joueur.
- Le mur pousse le joueur avec sa collision physique. Il ne perd une vie que s'il est comprimé contre un autre mur ou le bord de l'arène ; après l'arrivée du mur, il réapparaît sur une case libre.

### Interface — `src/entities/game_hud.js` et `src/scenes/game_over_scene.js`

- `GameHud` affiche le nombre de vies pendant la partie.
- `GameOverScene` est une vraie scène Phaser transparente superposée à la scène de jeu mise en pause. Le voile obscurcit l'arène à 50 % et ses boutons interactifs Phaser lancent l'accueil ou une partie neuve.

Pour afficher les hitboxes pendant le développement, passe `debug.enabled` à `true` dans `src/config/game_config.js`, puis relance l'application.

### Qualité des images

Le joueur est dessiné en vecteur par Phaser, et non agrandi depuis le PNG `public/assets/player.png`. Le canvas utilise jusqu'à deux fois la densité de pixels de l'écran ; cette limite conserve un rendu net sans créer des buffers excessivement grands.

## Évolutions prévues

Les prochaines étapes sont le multijoueur en salle et la condition de victoire « dernier survivant ». Le dash ou la poussée pourra être spécifié ensuite.
