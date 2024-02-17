class MainLevel extends Phaser.Scene {
    constructor() {
        super('mainLevelScene')
    }

    init() {        
        this.ROTATION_VELOCITY = 4;
        this.SPAWN_DELAY = 2000;
        this.INVINCIBILITY_TIME = 1000;
        this.TILE_SPEED = 1;
        this.CHANNELS = 8;
        this.RUNNER_COLLIDER_MULT = 2.6;
        this.KEY_TILE = "octagon-trapezoid";

        this.RUNNER_DEPTH = 30;
        this.LINES_DEPTH = 20;
        this.TILE_DEPTH = 10;
        this.BACK_DEPTH = 0;

        this.physics.world.drawDebug = false;
    }

    create() {
        // MUSIC AND SOUND ====================================================
        // this.music_intro = this.sound.add("music-intro");
        // this.music_loop = this.sound.add("music-loop");
        // this.music_loop.loop = true;

        // this.music_intro.once("complete", () => this.music_loop.play());
        // this.music_intro.play();

        // INPUT ==============================================================
        cursors = this.input.keyboard.createCursorKeys();   

        // BACKGROUND AND TILES ===============================================
        this.octagonBack = this.add.sprite(width/2, height/2, "octagon-back").setScale(1).setDepth(this.BACK_DEPTH);
        this.octagonLines = this.add.sprite(width/2, height/2, "octagon-lines").setScale(1).setDepth(this.LINES_DEPTH).setAlpha(1);
        this.tileParent = this.physics.add.group({ 
            defaultKey: this.KEY_TILE,
            classType: Tile
        });

        // PLAYER =============================================================
        this.runner = this.physics.add.sprite(game.config.width/2, 6*game.config.height/7, "runner", 0)
        this.runner.setScale(0.33).setDepth(this.RUNNER_DEPTH);
        this.runner.body.setSize(this.runner.width*this.RUNNER_COLLIDER_MULT,50);
        this.runner.body.setOffset(-this.runner.width*(this.RUNNER_COLLIDER_MULT-1)/2,this.runner.height-50);
        this.runner.invincible = false;

        this.anims.create({
            key: "idle",
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("runner", {start: 0, end: 1})
        });
        this.runner.play("idle");

        this.anims.create({
            key: "run",
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("runner", {start: 2, end: 3})
        });
        
        // PHYSICS AND COLLISION ==============================================
        this.physics.add.collider(this.runner, this.tileParent, this.handleCollision, null, this);

        // DEBUG CODE =========================================================
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

        if (rotationAmount == 0 && this.runner.anims.getName() != "idle") {
            this.runner.play("idle");
        }
        else if (rotationAmount != 0 && this.runner.anims.getName() != "run") {
            this.runner.play("run");
        }

        if (rotationAmount > 0) this.runner.flipX = false;
        if (rotationAmount < 0) this.runner.flipX = true;

        let delta = rotationAmount * this.ROTATION_VELOCITY;
        this.octagonBack.angle += delta;
        this.octagonLines.angle += delta;

        // update tiles
        this.tileParent.children.iterate(tile => {
            if (tile) tile.update(this.octagonLines.angle);
            else this.tileParent.remove(tile);
        })
    }

    spawnTiles() {
        // Spawns a round of new tiles!
        // ================

        this.sound.play("whoosh");

        let totalTiles = 4;
        let tilesSoFar = 0;

        for (let i = 0; i < this.CHANNELS; i++) {
            if (tilesSoFar < totalTiles)
            {
                if (Phaser.Math.Between(0,1) == 0) {
                    continue;
                }
                else {
                    tilesSoFar++;
                }
            }

            let tile = new Tile(this, game.config.width/2, game.config.height/2, this.KEY_TILE, 0,
                                this.tileParent, false, this.TILE_SPEED, this.CHANNELS, i).setDepth(this.TILE_DEPTH);
            tile.setActive(true).setVisible(true).setScale(0.1);

            this.tileParent.add(tile);
        }
    }

    handleCollision() {
        if (this.runner.invincible) {
            return;
        } else { // They aren't currently invincible. Mark them as such, so this function is only called once.
            this.runner.invincible = true;
        }

        this.playHurtNoise();

        this.time.addEvent({
            delay: this.INVINCIBILITY_TIME,
            loop: false,
            callbackScope: this,
            callback: () => {
                this.runner.invincible = false
            }
        });
    }

    playHurtNoise() {
        // Plays a random hurt noise! :D
        // ================

        if (Math.floor(Math.random() * 10) == 0) {  // 10% chance to play sound 5
            this.sound.play("pain-5");
            return;
        }

        let rng = Math.floor(Math.random() * 5);    // sounds 0-4
        this.sound.play(`pain-${rng}`);
    }
}