class MainMenu extends Phaser.Scene
{
    constructor() {
        super('mainMenuScene')
    }

    init() {
        this.FLASH_DELAY = 750;
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

        this.load.audio("music-intro", "./assets/sound/placeholder/dive-drive_intro.mp3");
        this.load.audio("music-loop", "./assets/sound/placeholder/dive-drive_loop.mp3");
    }

    create() {
        let menuConfig = 
        {
            fontFamily: "Courier",
            fortSize: "28px",
            backgroundColor: "#f3b141",
            color: "#843605",
            align: "right",
            padding: 
            {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

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
            //this.sound.play("sfx-select");
            this.scene.start("mainLevelScene");
        })
    }
}