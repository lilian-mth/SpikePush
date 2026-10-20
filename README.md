# SpikePush

SpikePush est un jeu d'arène multijoueur en vue de dessus, conçu pour navigateur. Le concept est une partie de survie : plusieurs joueurs partagent une petite salle, esquivent des piques qui sortent des murs et tentent de rester le dernier survivant.

> **État du projet :** le dépôt contient un prototype local avec un menu, un joueur, un joystick tactile et une arène. Le multijoueur, les piques, les vies et les avertissements visuels restent à développer.

## Concept et règles prévues

- Une salle accueille plusieurs joueurs, par exemple quatre.
- Chaque joueur commence avec trois vies.
- Des avertissements visuels annoncent le côté d'où les piques vont sortir.
- Les piques avancent depuis le mur annoncé jusqu'au mur opposé. Un joueur touché par leur pointe pendant leur déplacement perd une vie.
- Les vagues deviennent progressivement plus difficiles : les piques accélèrent et le délai d'avertissement raccourcit.
- Le dernier joueur encore en vie remporte la partie.
- Le prototype dispose d'un joystick virtuel sur les appareils tactiles. Les commandes clavier restent disponibles sur ordinateur.
- Une capacité de dash ou de poussée est envisagée, mais ses règles restent à définir.

Ces règles décrivent la direction souhaitée, pas des fonctionnalités déjà présentes dans le code.

## Prototype actuel

- Une arène carrée de **4 × 4 unités**.
- Quatre murs corail solides d'**1 unité d'épaisseur**, autour de l'arène.
- Une caméra centrée qui cadre **6 × 6 unités**, murs compris.
- Un joueur au centre, contrôlable au clavier avec les **flèches** ou **ZQSD**.
- Un joystick virtuel tactile en bas à gauche pendant la partie.
- Un écran d'accueil avec un bouton **JOUER** pour lancer la partie.
- Deux murs intérieurs solides de **1 × 1 unité**.
- Déplacement diagonal normalisé pour conserver la même vitesse dans toutes les directions.
- Le navigateur et l'interface sont affichés dans un cadre carré aussi grand que possible.

Il n'y a pour l'instant ni réseau/multijoueur, ni piques, ni vies ou condition de victoire.

## Échelle et dimensions

Les positions et dimensions Phaser sont exprimées en pixels du monde. Pour raisonner plus simplement, le projet définit une unité de jeu :

| Élément | Dimensions |
| --- | ---: |
| 1 unité (U) | 250 pixels du monde |
| Zone jouable | 4 × 4 U, soit 1 000 × 1 000 pixels |
| Chaque mur | 1 U d'épaisseur |
| Vue de la caméra | 6 × 6 U, soit 1 500 × 1 500 pixels |
| Vitesse du joueur | 300 pixels/s, soit 1,2 U/s |

Les murs ont une longueur de 6 U sur leur côté extérieur. Ils se rejoignent aux coins afin de fermer complètement l'arène. Les coins font partie de l'épaisseur des murs, ils ne réduisent donc pas la zone intérieure de 4 × 4 U.

La caméra prend la plus petite dimension de la fenêtre carrée et la divise par 1 500 pixels. Elle montre ainsi toujours le carré complet de 6 × 6 U. Le fond est crème (`#F4F1DE`) et les murs sont corail (`#E76F51`).

### Taille de l'image du joueur

L'image actuelle, `public/assets/player.png`, fait **114 × 150 pixels**. Le sprite est affiché à sa taille native, tandis que sa hitbox est un cercle de 50 pixels de rayon. Pour créer une nouvelle image, compare sa taille affichée à l'échelle du monde, pas uniquement sa résolution de dessin. Une hauteur de 0,5 à 0,7 U correspond à 125–175 pixels du monde avec l'échelle actuelle.

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
src/scenes/game_scene.js    Chargement, arène, collisions et caméra
src/entities/player.js      Sprite, contrôles, vitesse et rotation du joueur
src/entities/wall.js        Création d'un mur solide
src/entities/virtual_joystick.js Joystick tactile et entrée directionnelle
public/assets/player.png    Image du joueur
```

## Modifier les paramètres du jeu

Les réglages de gameplay et de présentation sont regroupés dans `src/config/game_config.js`, dans l'objet `GAME_CONFIG` :

- `unitPixels`, `arena` et `camera` règlent l'échelle, la taille de l'arène et le cadrage.
- `colors` regroupe le fond, les murs, le menu et le joystick.
- `player.startPositions` contient les positions de départ en unités, relatives au centre de l'arène. Pour l'instant, seul le premier départ est utilisé puisque le prototype n'a qu'un joueur.
- `player.speedUnitsPerSecond`, `hitboxRadiusUnits`, `hitboxOffsetUnits`, `origin` et `rotationStep` règlent le mouvement et le corps du joueur.
- `walls.thickness` règle l'épaisseur des murs extérieurs. `walls.internal` est la liste des murs intérieurs ; chaque entrée donne son centre (`x`, `y`) et ses dimensions (`width`, `height`) en unités. Par exemple, `{ x: -1, y: 0, width: 1, height: 1 }` place un mur carré d'une unité à gauche du centre.
- `joystick` règle les dimensions, la marge, la zone morte et l'apparence du joystick tactile.
- `home` règle les textes, les tailles de police, la position et les dimensions du bouton de l'écran d'accueil.

Les murs intérieurs sont positionnés par leur centre. L'axe X positif va vers la droite, et l'axe Y positif vers le bas. Les dimensions et positions du joueur et des murs sont converties en pixels Phaser avec `unitPixels`.

## Phaser : les fonctions importantes

Phaser est le moteur de jeu JavaScript utilisé ici pour afficher le canvas, lire les contrôles et gérer les collisions.

### Démarrage — `src/main.js`

- `new Phaser.Game(config)` crée et démarre le jeu.
- `type: Phaser.AUTO` laisse Phaser choisir le moteur de rendu disponible, WebGL ou Canvas.
- `parent: 'game-container'` place le canvas dans l'élément HTML correspondant.
- `Phaser.Scale.RESIZE` redimensionne le canvas avec son conteneur. Le CSS rend ce conteneur carré.
- `resolution: window.devicePixelRatio || 1` adapte la résolution du canvas à la densité de pixels de l'écran.
- `autoRound: true` arrondit les valeurs de rendu pour éviter les positions fractionnaires à l'affichage.
- `physics.default: 'arcade'` active Arcade Physics, le système de collisions 2D simple de Phaser.
- `scene: [HomeScene, GameScene]` enregistre les scènes dans le jeu et lance d'abord `HomeScene`.

### Écran d'accueil — `src/scenes/home_scene.js`

- `HomeScene` hérite de `Phaser.Scene` et reçoit la clé `HomeScene`.
- `create()` crée le titre, le sous-titre, le bouton et son texte.
- `setInteractive()` permet au rectangle du bouton de recevoir les événements de pointeur, souris ou tactile.
- `pointerover`, `pointerout` et `pointerdown` gèrent le survol, l'apparence du bouton et le démarrage de la partie.
- `this.scene.start('GameScene')` arrête l'écran d'accueil et démarre la scène de jeu.
- `layout()` centre les éléments ; l'événement `resize` la rappelle lorsque le canvas change de taille.

### Scène — `src/scenes/game_scene.js`

Une scène Phaser organise une partie ou un écran du jeu. Phaser appelle ses méthodes dans cet ordre :

1. `preload()` charge les ressources avant le démarrage de la scène. `this.load.image('perso', 'assets/player.png')` enregistre l'image sous la clé `perso`.
2. `create()` s'exécute une fois pour construire le monde : limites physiques, joueur, murs, collisions et caméra.
3. `update()` s'exécute à chaque image affichée et transmet l'actualisation au joueur.

Autres appels Phaser utilisés dans la scène :

- `this.physics.world.setBounds(x, y, width, height)` définit les limites du monde physique.
- `this.physics.add.collider(a, b)` empêche deux objets physiques de se traverser.
- `this.cameras.main.setBackgroundColor(color)` règle le fond visible par la caméra.
- `centerOn(x, y)` centre la vue sur une position du monde.
- `setZoom(zoom)` règle le rapport entre les pixels du monde et ceux de l'écran.
- `this.scale.on('resize', ...)` rappelle `ajusterZoom()` lorsque la taille du jeu change.

### Joueur — `src/entities/player.js`

- `scene.physics.add.sprite(x, y, 'perso')` crée un sprite avec un corps Arcade Physics.
- `setOrigin(x, y)` déplace le point d'origine utilisé pour positionner et faire tourner le sprite. Ici, les valeurs correspondent au visuel actuel de 114 × 150 pixels.
- `body.setCircle(50, 0, 25)` donne au joueur une hitbox circulaire de rayon 50 pixels, décalée par rapport au sprite.
- `body.setCollideWorldBounds(true)` active la collision avec les limites du monde.
- `createCursorKeys()` lit les flèches ; `addKeys('Z,Q,S,D')` lit les touches ZQSD.
- `body.setVelocity(x, y)` applique la vitesse du joueur en pixels par seconde.
- `Math.SQRT1_2` réduit les deux axes lors d'un déplacement diagonal afin que la diagonale ne soit pas plus rapide.
- `Phaser.Math.Angle.RotateTo(...)` fait tourner progressivement le sprite vers la direction du déplacement.

### Murs — `src/entities/wall.js`

- `scene.add.rectangle(x, y, width, height, color)` dessine le rectangle du mur.
- `scene.physics.add.existing(rectangle, true)` ajoute un corps Arcade statique : il ne bouge pas sous l'effet de la physique et peut bloquer le joueur.

### Joystick — `src/entities/virtual_joystick.js`

- Le joystick n'est créé que si Phaser détecte un appareil tactile.
- Une caméra HUD séparée garde le joystick à taille constante à l'écran malgré le zoom de la caméra du jeu.
- Les événements `pointerdown`, `pointermove` et `pointerup` capturent et suivent le doigt. Le stick renvoie une direction normalisée `x`/`y` que le joueur ajoute à ses contrôles clavier.
- `pointerupoutside` et l'événement de fermeture de la scène libèrent les entrées et les écouteurs.

## Évolutions prévues

Les principales prochaines étapes de conception et de développement sont le multijoueur en salle, le système de vagues et de vies, les avertissements et collisions des piques. Le dash ou la poussée pourra être spécifié ensuite.
