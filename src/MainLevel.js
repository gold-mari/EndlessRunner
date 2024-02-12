class MainLevel extends Phaser.Scene {
    constructor() {
        super('mainLevelScene')
    }

    init() {
        console.log("MainLevel: init");
        
        this.ROTATION_VELOCITY = 2;
        this.SPAWN_DELAY = 1500;
        this.TILE_SPEED = 1;
        this.CHANNELS = 8;
        this.RUNNER_COLLIDER_MULT = 4.6;
        this.KEY_TILE = "octagon-trapezoid";

        this.RUNNER_DEPTH = 20;
        this.FRAME_DEPTH = 10;
        this.TILE_DEPTH = 0;
    }

    preload() {
        
    }

    create() {
        // SPRITES AND ANIMATIONS
        this.octagonFrame = this.add.sprite(width/2, height/2, "octagon-lines").setScale(1).setDepth(this.FRAME_DEPTH);

        // MUSIC AND SOUND
        this.music_intro = this.sound.add("music-intro");
        this.music_loop = this.sound.add("music-loop");
        this.music_loop.loop = true;

        this.music_intro.once("complete", () => this.music_loop.play());
        this.music_intro.play();

        // INPUT
        cursors = this.input.keyboard.createCursorKeys();

        // TILES
        this.tileParent = this.physics.add.group({ 
            defaultKey: this.KEY_TILE,
            classType: Tile
        });

        // PLAYER
        this.runner = this.physics.add.sprite(game.config.width/2, 4*game.config.height/5, "runner").setScale(0.2).setDepth(this.RUNNER_DEPTH);
        this.runner.body.setSize(this.runner.width*this.RUNNER_COLLIDER_MULT,50);
        this.runner.body.setOffset(-this.runner.width*(this.RUNNER_COLLIDER_MULT-1)/2,this.runner.height-50);

        // DEBUG CODE
        // Show Debug toggle
        this.input.keyboard.on('keydown-D', function() {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this)

        // Timer code derived inspired by user James Skemp on StackOverflow:
        // https://stackoverflow.com/questions/62725455/how-to-run-a-function-each-minute-in-phaser-3
        this.spawnTimer = this.time.addEvent({
            delay: this.SPAWN_DELAY,
            loop: true,
            callbackScope: this,
            callback: this.spawnTiles
        });
	}

	update()
	{
        // INFO TEXT
		const size = this.tileParent.getLength()
        document.getElementById('info').innerHTML = `<strong>Controls</strong> Left/Right Arrows: rotate | D: debug (${this.physics.world.drawDebug}) ` +
                                                    `| visible: ${size}`;

        // INPUT
        let rotationAmount = 0
        // handle left-right
        if (cursors.left.isDown) rotationAmount += -1;
        if (cursors.right.isDown) rotationAmount += 1;

        let delta = rotationAmount * this.ROTATION_VELOCITY;
        this.octagonFrame.angle += delta;

        // update tiles
        this.tileParent.children.iterate(tile => {
            if (tile) tile.update(this.octagonFrame.angle);
            else this.tileParent.remove(tile);
        })
    }

    spawnTiles() {
        // Spawns a round of new tiles!
        // ================

        let totalGoodTiles = 4;
        let goodTilesSoFar = 0;

        for (let i = 0; i < this.CHANNELS; i++) {
            let good = true
            if (goodTilesSoFar < totalGoodTiles)
            {
                if (Phaser.Math.Between(0,1) == 0) good = false;
            }

            let tile = new Tile(this, game.config.width/2, game.config.height/2, this.KEY_TILE, 0,
                                this.tileParent, good, this.TILE_SPEED, this.CHANNELS, i).setDepth(this.TILE_DEPTH);
            tile.setActive(true).setVisible(true).setScale(0.1);

            this.tileParent.add(tile);
        }
    }
}