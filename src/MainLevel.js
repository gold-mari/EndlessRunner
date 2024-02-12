class MainLevel extends Phaser.Scene {
    constructor() {
        super('mainLevelScene')
    }

    init() {
        console.log("MainLevel: init");
        
        this.ROTATION_VELOCITY = 2;
    }

    preload() {
        
    }

    create() {
        // SPRITES AND ANIMATIONS
        this.octagonA = this.add.sprite(width/2, height/2, "octagon").setScale(0.667);

        // MUSIC AND SOUND
        this.music_intro = this.sound.add("music-intro");
        this.music_loop = this.sound.add("music-loop");
        this.music_loop.loop = true;

        this.music_intro.once("complete", () => this.music_loop.play());
        this.music_intro.play();

        // INPUT
        cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        let rotationAmount = 0
        // handle left-right
        if (cursors.left.isDown) rotationAmount += -1;
        if (cursors.right.isDown) rotationAmount += 1;

        let delta = rotationAmount * this.ROTATION_VELOCITY;
        this.octagonA.angle += delta;
        this.octagonB.angle += delta;
        this.octagonC.angle += delta;
        this.octagonD.angle += delta;
    }
}