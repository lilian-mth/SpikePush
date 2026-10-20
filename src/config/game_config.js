export const GAME_CONFIG = {
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
        homeButton: 0xe76f51,
        homeButtonHover: 0xd85e42,
        homeText: '#264653',
        joystickBase: 0x264653,
        joystickKnob: 0xe76f51
    },
    player: {
        asset: 'assets/player.png',
        startPositions: [{ x: 0, y: 0 }],
        speedUnitsPerSecond: 1.2,
        hitboxRadiusUnits: 0.2,
        hitboxOffsetUnits: { x: 0, y: 0.1 },
        origin: { x: 50 / 114, y: 75 / 150 },
        rotationStep: Math.PI / 20
    },
    walls: {
        thickness: 1,
        internal: [
            { x: -1, y: 0, width: 1, height: 1 },
            { x: 1, y: 0, width: 1, height: 1 }
        ]
    },
    joystick: {
        baseRadius: 58,
        knobRadius: 25,
        margin: 24,
        deadzone: 0.12,
        baseAlpha: 0.22,
        baseStrokeWidth: 3,
        baseStrokeAlpha: 0.55,
        knobAlpha: 0.8
    },
    home: {
        title: 'SpikePush',
        subtitle: 'Survis aux piques. Reste le dernier.',
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
