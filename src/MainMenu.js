class MainMenu extends Phaser.Scene
{
    constructor() {
        super('mainMenuScene')
    }

    preload() {
        this.load.image("octagon-back", "./assets/sprites/placeholder/octagon-back.png");
        this.load.image("octagon-lines", "./assets/sprites/placeholder/octagon-lines.png");
        this.load.image("octagon-trapezoid", "./assets/sprites/placeholder/octagon-trapezoid.png");
        this.load.image("runner", "./assets/sprites/placeholder/runner.png");

        this.load.audio("music-intro", "./assets/sound/placeholder/dive-drive_intro.mp3");
        this.load.audio("music-loop", "./assets/sound/placeholder/dive-drive_loop.mp3");
    }

    create() {
        this.scene.start("mainLevelScene");
    }
}