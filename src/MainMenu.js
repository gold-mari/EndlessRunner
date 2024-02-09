class MainMenu extends Phaser.Scene
{
    constructor() {
        super('mainMenuScene')
    }

    preload() {
        this.load.audio("music-intro", "./assets/sound/placeholder/dive-drive_intro.mp3");
        this.load.audio("music-loop", "./assets/sound/placeholder/dive-drive_loop.mp3");
    }

    create() {
        this.scene.start("mainLevelScene");
    }

    update() {
        
    }
}