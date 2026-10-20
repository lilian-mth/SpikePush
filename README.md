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
- Un joystick virtuel tactile dynamique, qui apparaît sous le doigt dans la moitié gauche de l'écran.
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
| Diamètre du joueur | 0,45 U, soit 112,5 pixels du monde |
| Vitesse du joueur | 375 pixels/s, soit 1,5 U/s |

Les murs ont une longueur de 6 U sur leur côté extérieur. Ils se rejoignent aux coins afin de fermer complètement l'arène. Les coins font partie de l'épaisseur des murs, ils ne réduisent donc pas la zone intérieure de 4 × 4 U.

La caméra prend la plus petite dimension de la fenêtre carrée et la divise par 1 500 pixels. Elle montre ainsi toujours le carré complet de 6 × 6 U. Le fond est crème (`#F4F1DE`) et les murs sont corail (`#E76F51`).

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
src/scenes/game_scene.js    Chargement, arène, collisions et caméra
src/entities/player.js      Cercle du joueur, hitbox, contrôles et vitesse
src/entities/wall.js        Création d'un mur solide
src/entities/virtual_joystick.js Joystick tactile et entrée directionnelle
public/assets/player.png    Ancienne image du joueur (le prototype utilise un cercle vectoriel)
```

## Modifier les paramètres du jeu

Les réglages de gameplay et de présentation sont regroupés dans `src/config/game_config.js`, dans l'objet `GAME_CONFIG` :

- `unitPixels`, `arena` et `camera` règlent l'échelle, la taille de l'arène et le cadrage.
- `colors` regroupe le fond, les murs, le menu et le joystick.
- `player.startPositions` contient les positions de départ en unités, relatives au centre de l'arène. Pour l'instant, seul le premier départ est utilisé puisque le prototype n'a qu'un joueur.
- `player.diameterUnits` et `speedUnitsPerSecond` règlent la taille et le mouvement du joueur. La hitbox circulaire est alignée sur le diamètre visible.
- `walls.thickness` règle l'épaisseur des murs extérieurs. `walls.internal` contient les coordonnées `column` et `row` des cases occupées par les obstacles intérieurs. Chaque obstacle occupe une case de 1 × 1 U ; colonnes et lignes commencent à 0 en haut à gauche.
- `joystick` règle la taille, la zone d'apparition, la zone morte et l'apparence grise du joystick tactile.
- `home` règle les textes, les tailles de police, la position et les dimensions du bouton de l'écran d'accueil.

Les murs intérieurs sont positionnés par leur centre. L'axe X positif va vers la droite, et l'axe Y positif vers le bas. Les dimensions et positions du joueur et des murs sont converties en pixels Phaser avec `unitPixels`.

## Phaser : les fonctions importantes

Phaser est le moteur de jeu JavaScript utilisé ici pour afficher le canvas, lire les contrôles et gérer les collisions.

### Démarrage — `src/main.js`

- `new Phaser.Game(config)` crée et démarre le jeu.
- `type: Phaser.AUTO` laisse Phaser choisir le moteur de rendu disponible, WebGL ou Canvas.
- `parent: 'game-container'` place le canvas dans l'élément HTML correspondant.
- `Phaser.Scale.FIT` conserve la résolution interne haute définition et ajuste son affichage au conteneur carré.
- La résolution interne est calculée depuis la taille de la fenêtre et la densité de pixels de l'écran, plafonnée à 2× pour préserver les performances. Elle est actualisée quand la fenêtre change de taille.
- `antialias: true`, `pixelArt: false` et `roundPixels: false` privilégient un rendu lissé, adapté aux illustrations non pixel art.
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

1. `preload()` est la phase de chargement des ressources si la scène en utilise. La scène de jeu actuelle dessine le joueur en vecteur et n'a pas de ressource à charger.
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

- `scene.add.circle(x, y, radius, color)` dessine le joueur comme une forme vectorielle ; `scene.physics.add.existing(circle)` lui ajoute un corps Arcade Physics et `body.setCircle(radius)` aligne sa hitbox sur son dessin.
- `body.setCollideWorldBounds(true)` active la collision avec les limites du monde.
- `createCursorKeys()` lit les flèches ; `addKeys('Z,Q,S,D')` lit les touches ZQSD.
- `body.setVelocity(x, y)` applique la vitesse du joueur en pixels par seconde.
- La norme du vecteur de déplacement limite sa longueur à 1, pour conserver la même vitesse dans toutes les directions.

### Murs — `src/entities/wall.js`

- `scene.add.rectangle(x, y, width, height, color)` dessine le rectangle du mur.
- `scene.physics.add.existing(rectangle, true)` ajoute un corps Arcade statique : il ne bouge pas sous l'effet de la physique et peut bloquer le joueur.

### Joystick — `src/entities/virtual_joystick.js`

- Le joystick n'est créé que si Phaser détecte un appareil tactile.
- Au toucher dans la moitié gauche de l'écran, la base apparaît à cet emplacement et le joystick suit le doigt. Il se masque lorsque le doigt est relâché.
- Une caméra HUD séparée garde le joystick à taille constante à l'écran malgré le zoom de la caméra du jeu.
- Les événements `pointerdown`, `pointermove` et `pointerup` capturent et suivent le doigt. Le stick renvoie une direction normalisée `x`/`y` que le joueur ajoute à ses contrôles clavier.
- `pointerupoutside` et l'événement de fermeture de la scène libèrent les entrées et les écouteurs.

### Qualité des images

Le joueur est dessiné en vecteur par Phaser, et non agrandi depuis le PNG `public/assets/player.png`. Le canvas utilise jusqu'à deux fois la densité de pixels de l'écran ; cette limite conserve un rendu net sans créer des buffers excessivement grands.

## Évolutions prévues

Les principales prochaines étapes de conception et de développement sont le multijoueur en salle, le système de vagues et de vies, les avertissements et collisions des piques. Le dash ou la poussée pourra être spécifié ensuite.
