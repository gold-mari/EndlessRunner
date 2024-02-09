class MainLevel extends Phaser.Scene {
    constructor() {
        super('mainLevelScene')
    }

    init() {
        console.log("MainLevel: init");   
    }

    preload() {
        
    }

    create() {
        this.music_intro = this.sound.add("music-intro");
        this.music_loop = this.sound.add("music-loop");
        this.music_loop.loop = true;

        this.music_intro.on("complete", () => this.music_loop.play());
        this.music_intro.play();
    }

    update() {
        
    }
}