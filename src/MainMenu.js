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
        this.load.image("logo", "./assets/sprites/logo.png");
        this.load.image("anykey", "./assets/sprites/anykey.png");

        this.load.image("instructions", "./assets/sprites/instructions.png");
        this.load.image("octagon-back", "./assets/sprites/octagon-back.png");
        this.load.image("octagon-lines", "./assets/sprites/octagon-lines.png");
        this.load.image("octagon-trapezoid", "./assets/sprites/octagon-trapezoid.png");

        this.load.spritesheet("runner", "./assets/sprites/runner.png", { frameWidth: 200, frameHeight: 200 });
        this.load.spritesheet("heart", "./assets/sprites/hearts.png", { frameWidth: 80, frameHeight: 80 });

        this.load.audio("menu-bark", "./assets/sound/bill-got-stuck.mp3");
        this.load.audio("main-theme", "./assets/sound/main-theme.mp3");

        this.load.audio("lets-do-this", "./assets/sound/lets-do-this.mp3");
        this.load.audio("whoosh", "./assets/sound/whoosh.mp3");
        this.load.audio("pain-0", "./assets/sound/pain-0.mp3");
        this.load.audio("pain-1", "./assets/sound/pain-1.mp3");
        this.load.audio("pain-2", "./assets/sound/pain-2.mp3");
        this.load.audio("pain-3", "./assets/sound/pain-3.mp3");
        this.load.audio("pain-4", "./assets/sound/pain-4.mp3");
        this.load.audio("pain-5", "./assets/sound/pain-5.mp3");
        this.load.audio("i-give-up", "./assets/sound/lose.mp3");
    }

    create() {
        // display menu        
        this.add.sprite(game.config.width*0.5,game.config.height*0.4, "logo").setOrigin(0.5).setScale(0.5);
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