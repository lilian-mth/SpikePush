# SpikePush

SpikePush est un jeu d'arène multijoueur en vue de dessus, conçu pour navigateur. Le concept est une partie de survie : plusieurs joueurs partagent une petite salle, esquivent des scies qui surgissent des murs et tentent de rester le dernier survivant.

> **État du projet :** le prototype local comprend le menu, l'arène, un joueur, 16 scies visibles autour de la bordure, des vagues et trois vies. Le multijoueur reste à développer.

## Concept et règles prévues

- Une salle accueille plusieurs joueurs, par exemple quatre.
- Chaque joueur commence avec trois vies.
- Les quatre scies du côté choisi sortent légèrement du mur pour signaler une vague ; cette phase ne cause pas de dégâts.
- Elles tournent et avancent jusqu'à leur position d'arrêt calculée avant un obstacle. Une fois toutes arrêtées, elles reviennent ensemble à leur position d'attente sur la bordure.
- Le contact avec une scie en mouvement retire une vie. Le joueur réapparaît après le retour des scies.
- Pendant leur déplacement, les scies alternent entre trois images. Les vagues deviennent progressivement plus difficiles : elles accélèrent et le délai d'avertissement raccourcit.
- Le dernier joueur encore en vie remporte la partie.
- Le prototype dispose d'un joystick virtuel sur les appareils tactiles. Les commandes clavier restent disponibles sur ordinateur.
- Une capacité de dash ou de poussée est envisagée, mais ses règles restent à définir.

Le prototype gère déjà les vagues, les avertissements et les vies pour un joueur. Le multijoueur, la victoire du dernier survivant et le dash restent à développer.

## Prototype actuel

- Une arène carrée de **4 × 4 unités**.
- Quatre murs corail solides d'**1 unité d'épaisseur**, autour de l'arène.
- Une caméra centrée qui cadre **6 × 6 unités**, murs compris.
- Un joueur dans la case en bas à gauche, contrôlable au clavier avec les **flèches** ou **ZQSD**.
- Un joystick virtuel tactile dynamique, qui apparaît sous le doigt partout sur l'écran de jeu.
- Un écran d'accueil avec un bouton **JOUER** pour lancer la partie.
- Deux murs intérieurs solides de **1 × 1 unité**.
- 16 scies assemblées, quatre visibles de chaque côté de l'arène.
- Des vagues où les quatre scies d'un côté aléatoire sortent brièvement du mur avant de charger.
- Trois vies et un écran d'élimination avec un retour au menu.
- Après avoir perdu une vie, le joueur réapparaît dans une case libre après la rétractation des scies.
- Déplacement diagonal normalisé pour conserver la même vitesse dans toutes les directions.
- Le navigateur et l'interface sont affichés dans un cadre carré aussi grand que possible.

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
| Vitesse du joueur | 500 pixels/s, soit 2 U/s |
| Scie | 0,9 U de diamètre |
| Couloir d'une vague | 4 scies espacées d'1 U |

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
src/entities/wall.js        Création d'un mur solide
src/entities/saw.js         Scie, mouvement, animation par images et hitbox
src/entities/virtual_joystick.js Joystick tactile et entrée directionnelle
public/assets/saw1.png      Première image de l'animation de scie
public/assets/saw2.png      Deuxième image de l'animation de scie
public/assets/saw3.png      Troisième image de l'animation de scie
public/assets/player.png    Ancienne image du joueur (le prototype utilise un cercle vectoriel)
```

## Modifier les paramètres du jeu

Les réglages de gameplay et de présentation sont regroupés dans `src/config/game_config.js`, dans l'objet `GAME_CONFIG` :

- `unitPixels`, `arena` et `camera` règlent l'échelle, la taille de l'arène et le cadrage.
- `colors` regroupe le fond, les murs, le menu et le joystick.
- `player.startPositions` contient les positions de départ en unités, relatives au centre de l'arène. Pour l'instant, seul le premier départ est utilisé puisque le prototype n'a qu'un joueur. La position `(-1.5, 1.5)` correspond au centre de la case en bas à gauche d'une arène de 4 × 4 U.
- `player.diameterUnits`, `speedUnitsPerSecond` et `lives` règlent la taille, le mouvement et le nombre de vies du joueur. La hitbox circulaire est alignée sur le diamètre visible.
- `player.respawnSafeMarginUnits` règle la marge supplémentaire utilisée pour calculer les cases sûres de réapparition. Ces cases sont calculées au démarrage en tenant compte des murs.
- `walls.thickness` règle l'épaisseur des murs extérieurs. `walls.internal` contient les coordonnées `column` et `row` des cases occupées par les obstacles intérieurs. Chaque obstacle occupe une case de 1 × 1 U ; colonnes et lignes commencent à 0 en haut à gauche.
- `saw.animationAssets` contient les trois images successives de l'animation ; `animationFrameDurationMs` règle la durée de chaque image. `diameterUnits` règle la taille des scies et de leur hitbox ; `countPerSide` règle le nombre de scies visibles sur chaque côté.
- `waves.warningDistanceUnits` règle la courte sortie inoffensive avant la vague. Les autres paramètres `waves.warning...` définissent sa durée et son évolution. `speedUnitsPerSecond`, `speedIncreasePerWave` et `maximumSpeedUnitsPerSecond` règlent l'accélération ; `betweenWavesMs` définit la pause.
- `ui.hud` et `ui.gameOver` regroupent les textes et dimensions de l'interface, sans les mélanger aux paramètres des scies ou du joueur.
- `saw.depth` règle la profondeur de dessin des scies ; la valeur par défaut les place sous les murs.
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

1. `preload()` charge les trois images d'animation des scies.
2. `create()` s'exécute une fois pour construire le monde : limites physiques, joueur, murs, collisions, HUD et caméra.
3. `update()` s'exécute à chaque image affichée et actualise le joueur et les scies.
4. L'événement `postupdate` synchronise l'illustration mobile de chaque scie sur son corps physique après le déplacement.
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
- `takeDamage()` retire une vie au contact d'une scie ; le corps du joueur est désactivé le temps de sa réapparition pour empêcher plusieurs dégâts sur le même contact.

### Murs — `src/entities/wall.js`

- `scene.add.rectangle(x, y, width, height, color)` dessine le rectangle du mur.
- `scene.physics.add.existing(rectangle, true)` ajoute un corps Arcade statique : il ne bouge pas sous l'effet de la physique et peut bloquer le joueur.

### Joystick — `src/entities/virtual_joystick.js`

- Le joystick n'est créé que si Phaser détecte un appareil tactile.
- Le canvas couvre tout le viewport : au toucher n'importe où sur l'écran, la base apparaît à la position touchée ou au bord le plus proche du canvas. Le joystick suit le doigt et se masque lorsqu'il est relâché.
- Une caméra HUD séparée garde le joystick et l'interface à taille constante à l'écran malgré le zoom de la caméra du jeu.
- Les événements pointeur capturés sur toute la fenêtre suivent le doigt. Le stick renvoie une direction normalisée `x`/`y` que le joueur ajoute à ses contrôles clavier.
- `pointerup`, `pointercancel` et la fermeture de la scène libèrent le joystick et ses écouteurs.

### Scies et vagues — `src/entities/saw.js` et `src/scenes/game_scene.js`

- La classe `Saw` crée 16 scies autour de l'arène. Chaque scie alterne en permanence entre les trois images configurées, y compris à l'arrêt et pendant l'avertissement, sans rotation de sprite.
- Une hitbox circulaire invisible suit chaque scie. `physics.add.overlap()` détecte le contact sans résoudre physiquement la collision : le joueur ne pousse pas les scies et elles ne bloquent pas son déplacement.
- Chaque trajectoire calcule sa position d'arrêt à partir des murs de sa voie. Si un mur intérieur est directement contre le mur de sortie, la scie s'arrête à son point de départ au lieu de traverser l'obstacle.
- Le cycle d'une vague est : sortie légère sans dégâts, déplacement tournant, arrêt des quatre scies, retour synchronisé à la bordure, réapparition du joueur si nécessaire, puis pause avant la prochaine vague.
- La vague choisit un côté au hasard. La vitesse augmente et la durée d'avertissement diminue à chaque nouvelle vague, selon les plafonds et minima de configuration.
- Les scies sont dessinées au-dessus des murs extérieurs pour rester visibles en attente.
- Les positions de réapparition sont calculées une fois à partir des cases libres et des murs. Le joueur revient après que les scies actives ont regagné leur position d'attente.

### Interface — `src/entities/game_hud.js` et `src/scenes/game_over_scene.js`

- `GameHud` affiche le nombre de vies pendant la partie.
- `GameOverScene` est une vraie scène Phaser transparente superposée à la scène de jeu mise en pause. Le voile obscurcit l'arène à 50 % et ses boutons interactifs Phaser lancent l'accueil ou une partie neuve.

Pour afficher les hitboxes pendant le développement, passe `debug.enabled` à `true` dans `src/config/game_config.js`, puis relance l'application.

### Qualité des images

Le joueur est dessiné en vecteur par Phaser, et non agrandi depuis le PNG `public/assets/player.png`. Le canvas utilise jusqu'à deux fois la densité de pixels de l'écran ; cette limite conserve un rendu net sans créer des buffers excessivement grands.

## Évolutions prévues

Les prochaines étapes sont le multijoueur en salle et la condition de victoire « dernier survivant ». Le dash ou la poussée pourra être spécifié ensuite.
