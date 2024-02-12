class MainLevel extends Phaser.Scene {
    constructor() {
        super('mainLevelScene')
    }

    init() {
        console.log("MainLevel: init");
        
        this.ROTATION_VELOCITY = 2;
        this.SPAWN_DELAY = 1000;
        this.TILE_SPEED = 1;
        this.CHANNELS = 8;
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

        // TILES
        this.tileParent = this.physics.add.group();

        // DEBUG CODE
        // Show Debug toggle
        this.input.keyboard.on('keydown-D', function() {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this)

        // update instruction text
        document.getElementById('info').innerHTML = '<strong>Controls</strong> Left/Right Arrows: rotate | D: debug (toggle)'

        // Timer code derived inspired by user James Skemp on StackOverflow:
        // https://stackoverflow.com/questions/62725455/how-to-run-a-function-each-minute-in-phaser-3
        this.spawnTimer = this.time.addEvent({
            delay: this.SPAWN_DELAY,
            loop: true,
            callbackScope: this,
            callback: this.spawnTiles
        });
    }

    update() {
        // INPUT
        let rotationAmount = 0
        // handle left-right
        if (cursors.left.isDown) rotationAmount += -1;
        if (cursors.right.isDown) rotationAmount += 1;

        let delta = rotationAmount * this.ROTATION_VELOCITY;
        this.octagonA.angle += delta;

        // update tiles
        this.tileParent.children.iterate(child => {
            child.update(this.octagonA.angle);
        })
    }

    spawnTiles() {
        // Spawns a round of new tiles!
        // ================

        for (let i = 0; i < this.CHANNELS; i++) {
            let tile = new Tile(this, game.config.width/2, game.config.height/2, 
                                "octagon", 0, true, 
                                this.CHANNELS, i, this.TILE_SPEED);
            tile.setScale(0.02);
            tile.setGroup(this.tileParent);
            this.tileParent.add(tile);
        }
    }
}