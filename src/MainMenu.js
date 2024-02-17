class MainMenu extends Phaser.Scene
{
    constructor() {
        super('mainMenuScene')
    }

    init() {
        this.FLASH_DELAY = 750;
        this.SFX_DELAY = 6030;
    }
    
    preload() {
        this.load.image("logo", "./assets/sprites/final/logo.png");
        this.load.image("anykey", "./assets/sprites/final/anykey.png");

        this.load.image("octagon-back", "./assets/sprites/final/octagon-back.png");
        this.load.image("octagon-lines", "./assets/sprites/final/octagon-lines.png");
        this.load.image("octagon-trapezoid", "./assets/sprites/final/octagon-trapezoid.png");

        this.load.spritesheet("runner", "./assets/sprites/final/runner.png", {
            frameWidth: 200,
            frameHeight: 200
        })

        this.load.audio("menu-bark", "./assets/sound/final/bill-got-stuck.mp3");
        this.load.audio("main-theme", "./assets/sound/final/main-theme.mp3");

        this.load.audio("lets-do-this", "./assets/sound/final/lets-do-this.mp3");
        this.load.audio("whoosh", "./assets/sound/final/whoosh.mp3");
    }

    create() {
        // display menu        
        this.add.sprite(game.config.width*0.5,game.config.height*0.4, "logo").setOrigin(0.5).setScale(0.6);
        this.anykey = this.add.sprite(game.config.width*0.5,game.config.height*0.8, "anykey").setOrigin(0.5).setScale(0.35);

        // flash 'anykey' prompt
        this.flashTimer = this.time.addEvent({
            delay: this.FLASH_DELAY,
            loop: true,
            callbackScope: this,
            callback: () => {
                let currentAlpha = this.anykey.alpha;
                this.anykey.alpha = (currentAlpha == 1) ? 0 : 1;
            }
        });

        // prepare for start
        this.input.keyboard.on('keydown', () => {
            this.bark.stop();
            this.sound.play("lets-do-this");
            if (!this.music.isPlaying) this.music.play();
            this.scene.start("mainLevelScene");
        })

        // play sounds
        this.game.sound.stopAll();
        
        this.bark = this.sound.add("menu-bark");
        this.music = this.sound.add("main-theme");
        this.music.loop = true;

        // when the menu bark is complete, play the music
        this.bark.once("complete", () => {
            this.music.play();
        });

        this.bark.play();
    }
}