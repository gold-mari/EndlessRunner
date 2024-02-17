class MainMenu extends Phaser.Scene
{
    constructor() {
        super('mainMenuScene')
    }

    preload() {
        this.load.image("octagon-back", "./assets/sprites/final/octagon-back.png");
        this.load.image("octagon-lines", "./assets/sprites/final/octagon-lines.png");
        this.load.image("octagon-trapezoid", "./assets/sprites/final/octagon-trapezoid.png");

        this.load.spritesheet("runner", "./assets/sprites/final/runner.png", {
            frameWidth: 200,
            frameHeight: 200
        })

        this.load.audio("music-intro", "./assets/sound/placeholder/dive-drive_intro.mp3");
        this.load.audio("music-loop", "./assets/sound/placeholder/dive-drive_loop.mp3");
    }

    create() {
        this.scene.start("mainLevelScene");
    }
}