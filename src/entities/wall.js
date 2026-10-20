export default class Wall {
    constructor(scene, x, y, width, height, color) {
        this.rectangle = scene.add.rectangle(x, y, width, height, color);
        scene.physics.add.existing(this.rectangle, true);
    }
}
