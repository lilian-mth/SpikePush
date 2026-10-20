# SpikePush

SpikePush est un jeu d'arène multijoueur en vue de dessus, conçu pour navigateur. Le concept est une partie de survie : plusieurs joueurs partagent une petite salle, esquivent des piques qui sortent des murs et tentent de rester le dernier survivant.

> **État du projet :** le dépôt contient actuellement un prototype local de déplacement dans une arène. Le multijoueur, les piques, les vies, les avertissements visuels et les contrôles tactiles décrits dans le concept restent à développer.

## Concept et règles prévues

- Une salle accueille plusieurs joueurs, par exemple quatre.
- Chaque joueur commence avec trois vies.
- Des avertissements visuels annoncent le côté d'où les piques vont sortir.
- Les piques avancent depuis le mur annoncé jusqu'au mur opposé. Un joueur touché par leur pointe pendant leur déplacement perd une vie.
- Les vagues deviennent progressivement plus difficiles : les piques accélèrent et le délai d'avertissement raccourcit.
- Le dernier joueur encore en vie remporte la partie.
- Les contrôles mobiles utiliseront un joystick virtuel. Une capacité de dash ou de poussée est envisagée, mais ses règles restent à définir.

Ces règles décrivent la direction souhaitée, pas des fonctionnalités déjà présentes dans le code.

## Prototype actuel

- Une arène carrée de **4 × 4 unités**.
- Quatre murs corail solides d'**1 unité d'épaisseur**, autour de l'arène.
- Une caméra centrée qui cadre **6 × 6 unités**, murs compris.
- Un joueur au centre, contrôlable au clavier avec les **flèches** ou **ZQSD**.
- Déplacement diagonal normalisé pour conserver la même vitesse dans toutes les directions.
- Le navigateur et l'interface sont affichés dans un cadre carré aussi grand que possible.

Il n'y a pour l'instant ni réseau/multijoueur, ni piques, ni vies ou condition de victoire, ni joystick tactile.

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
src/scenes/game_scene.js    Chargement, création de l'arène et caméra
src/entities/player.js      Sprite, contrôles, vitesse et rotation du joueur
src/entities/wall.js        Création d'un mur solide
public/assets/player.png    Image du joueur
```

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
- `scene: [GameScene]` indique la scène lancée au démarrage.

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

## Évolutions prévues

Les principales prochaines étapes de conception et de développement sont le multijoueur en salle, le système de vagues et de vies, les avertissements et collisions des piques, puis le joystick tactile. Le dash ou la poussée pourra être spécifié ensuite.
