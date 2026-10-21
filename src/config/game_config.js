export const GAME_CONFIG = {
    debug: {
        enabled: false,
        bodyColor: 0xff00ff,
        staticBodyColor: 0x0000ff,
        velocityColor: 0x00ff00
    },
    unitPixels: 250,
    arena: {
        width: 4,
        height: 4
    },
    camera: {
        width: 6,
        height: 6
    },
    colors: {
        background: '#F4F1DE',
        walls: 0xe76f51,
        player: 0x56729e,
        homeButton: 0xe76f51,
        homeButtonHover: 0xd85e42,
        homeText: '#264653',
        joystickBase: 0x555555,
        joystickStroke: 0x777777,
        joystickKnob: 0x999999,
        gameOver: 0x264653
    },
    player: {
        diameterUnits: 0.45,
        startPositions: [{ x: -1.5, y: 1.5 }],
        speedUnitsPerSecond: 2,
        respawnSafeMarginUnits: 0.1,
        lives: 3
    },
    walls: {
        thickness: 1,
        internal: [
            { column: 3, row: 1 },
            { column: 1, row: 2 }
        ]
    },
    saw: {
        animationAssets: [
            'assets/saw1.png',
            'assets/saw2.png',
            'assets/saw3.png'
        ],
        animationFrameDurationMs: 20,
        diameterUnits: 0.9,
        depth: 1,
        countPerSide: 4
    },
    waves: {
        warningDurationMs: 1500,
        warningDistanceUnits: 0.25,
        warningMinimumDurationMs: 500,
        warningReductionPerWaveMs: 75,
        speedUnitsPerSecond: 2,
        speedIncreasePerWave: 0.15,
        maximumSpeedUnitsPerSecond: 4,
        betweenWavesMs: 700
    },
    ui: {
        hud: {
            livesLabel: 'VIES'
        },
        gameOver: {
            label: 'ÉLIMINÉ',
            returnToMenuLabel: 'MENU PRINCIPAL',
            retryLabel: 'RÉESSAYER',
            buttonWidth: 280,
            buttonHeight: 64
        }
    },
    joystick: {
        baseRadius: 58,
        knobRadius: 25,
        deadzone: 0.12,
        baseAlpha: 0.22,
        baseStrokeWidth: 3,
        baseStrokeAlpha: 0.55,
        knobAlpha: 0.9
    },
    home: {
        title: 'SpikePush',
        subtitle: 'Survis aux scies. Reste le dernier.',
        playLabel: 'JOUER',
        buttonWidth: 220,
        buttonHeight: 72,
        titleFontSize: 64,
        subtitleFontSize: 20,
        buttonFontSize: 28,
        titleOffsetY: -100,
        subtitleOffsetY: -25,
        buttonOffsetY: 70,
        buttonTextColor: '#FFFFFF'
    }
};
