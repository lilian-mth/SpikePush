# 🗡️ SpikePush

> **Poussez. Cachez-vous. Survivez.**

**SpikePush** est un *party game* multijoueur sur navigateur en vue *top-down*. Le but est simple : survivre à des piques mortelles qui sortent des murs en se cachant derrière les rares couvertures disponibles. Le problème ? Il n'y a pas assez de place pour tout le monde. Bousculez vos adversaires pour voler leur place et assurer votre victoire !

Actuellement en cours de développement, le jeu est jouable directement dans le navigateur, sur PC et mobile.

![Démo de SpikePush](lien_vers_ton_gif_ou_screenshot.gif) <!-- Remplace par un GIF de la grille 5x5 avec les déplacements -->

## 🕹️ Jouer à SpikePush

*(Lien vers la version live du jeu hébergée sur Render, à ajouter plus tard)*

### Contrôles

*   **PC :** Touches `Z`, `Q`, `S`, `D` pour se déplacer.
*   **Mobile :** Joystick tactile virtuel intégré à l'écran.

## 🛠️ Stack Technique

Le jeu est construit avec des technologies web standards pour garantir une accessibilité maximale sans téléchargement.

*   **Frontend :** HTML5, CSS3, Vanilla JavaScript (pour l'instant basé sur une grille 5x5).
*   **Backend (Multijoueur) :** Serveur **Node.js** (prévu pour être hébergé sur **Render**). Utilisation de WebSockets (ex: Socket.io) à venir pour la synchronisation en temps réel.
*   **Base de données :** Hébergée chez **Hostinger** (MySQL/MariaDB ou autre selon la configuration). Elle servira à :
    *   Système de comptes (pseudos, connexion automatique).
    *   Sauvegarde de la progression.
    *   Système d'amis et invitations directes.

## 🚀 État actuel (Prototype)

Le projet est à ses débuts. Actuellement, le prototype comprend :
- [x] Rendu de la carte (grille 5x5).
- [x] Déplacement de base du personnage.
- [x] Contrôles au clavier (ZQSD) pour PC.
- [x] Contrôles tactiles (Joystick) pour mobile.

### Prochaines étapes de développement :
- [ ] Implémentation du backend Node.js pour connecter plusieurs joueurs simultanément.
- [ ] Mécanique de poussée (collisions entre joueurs).
- [ ] Système d'arène : apparition des *warnings* et des piques.
- [ ] Intégration de la base de données Hostinger pour les comptes joueurs.

## 💻 Installation en local (Développement)

Si vous souhaitez faire tourner le projet sur votre machine :

1.  Clonez le dépôt :
    ```bash
    git clone [https://github.com/ton-nom-utilisateur/spikepush.git](https://github.com/ton-nom-utilisateur/spikepush.git)
    ```
2.  *(Instructions pour le backend à venir : ex: `npm install` puis `node server.js`)*
3.  Ouvrez le fichier `index.html` dans votre navigateur (ou utilisez un serveur local comme Live Server sur VS Code) pour tester le frontend.