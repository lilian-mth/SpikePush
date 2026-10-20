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
        player: 0x56729e,
        homeButton: 0xe76f51,
        homeButtonHover: 0xd85e42,
        homeText: '#264653',
        joystickBase: 0x777777,
        joystickStroke: 0xaaaaaa,
        joystickKnob: 0xdddddd
    },
    player: {
        diameterUnits: 0.45,
        startPositions: [{ x: 0, y: 0 }],
        speedUnitsPerSecond: 1.5
    },
    walls: {
        thickness: 1,
        internal: [
            { column: 3, row: 1 },
            { column: 1, row: 2 }
        ]
    },
    joystick: {
        baseRadius: 58,
        knobRadius: 25,
        deadzone: 0.12,
        baseAlpha: 0.22,
        baseStrokeWidth: 3,
        baseStrokeAlpha: 0.55,
        knobAlpha: 0.8,
        activeZoneWidth: 0.5
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
