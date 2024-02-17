class MainLevel extends Phaser.Scene {
    constructor() {
        super('mainLevelScene')
    }

    init() {
        this.INSTRUCTION_FADE_TIME = 4000;
        this.ROTATION_VELOCITY = 6;
        this.SPAWN_DELAY = 2000;
        this.DIFFICULTY_DELAY = 10000;
        this.INVINCIBILITY_TIME = 1000;
        this.TILE_SPEED = 1;
        this.MAX_HEALTH = 5;
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
        // INPUT ==============================================================
        cursors = this.input.keyboard.createCursorKeys();
        esc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.instructions = this.add.sprite(width/2, height*0.4, "instructions").setScale(0.7).setDepth(this.RUNNER_DEPTH).setAlpha(1);
        this.tweens.add({
            targets: this.instructions,
            alpha: { value: 0, duration: this.INSTRUCTION_FADE_TIME, ease: 'Linear' }
        });

        // PLAYER =============================================================
        this.runner = this.physics.add.sprite(game.config.width/2, 6*game.config.height/7, "runner", 0)
        this.runner.setScale(0.33).setDepth(this.RUNNER_DEPTH);
        this.runner.body.setSize(this.runner.width*this.RUNNER_COLLIDER_MULT,50);
        this.runner.body.setOffset(-this.runner.width*(this.RUNNER_COLLIDER_MULT-1)/2,this.runner.height-50);
        this.runner.invincible = false;
        this.runner.health = this.MAX_HEALTH;
        this.runner.dead = false;

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

        this.anims.create({
            key: "dead",
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("runner", {start: 4, end: 5})
        });

        // HEARTS =============================================================
        this.heartsDict = {};
        for (let i=0; i<this.MAX_HEALTH; i++) {
            let heart = this.add.sprite((i*80)+50, 50, "heart", 0).setDepth(this.RUNNER_DEPTH);
            this.heartsDict[i] = heart;
        }

        // BACKGROUND AND TILES ===============================================
        this.octagonBack = this.add.sprite(width/2, height/2, "octagon-back").setDepth(this.BACK_DEPTH);
        this.octagonLines = this.add.sprite(width/2, height/2, "octagon-lines").setDepth(this.LINES_DEPTH);
        this.tileParent = this.physics.add.group({ 
            defaultKey: this.KEY_TILE,
            classType: Tile
        });

        this.spawnTimer = this.time.addEvent({
            delay: this.SPAWN_DELAY,
            loop: true,
            callbackScope: this,
            callback: this.spawnTiles
        });
        
        // PHYSICS AND COLLISION ==============================================
        this.physics.add.collider(this.runner, this.tileParent, this.handleCollision, null, this);

        // DIFFICULTY MANAGEMENT ==============================================
        this.minTiles = 2;
        this.maxTiles = 4;
        // Timer code derived inspired by user James Skemp on StackOverflow:
        // https://stackoverflow.com/questions/62725455/how-to-run-a-function-each-minute-in-phaser-3
        this.difficultyTimer = this.time.addEvent({
            delay: this.DIFFICULTY_DELAY,
            loop: true,
            callbackScope: this,
            callback: () => {
                this.minTiles = (this.minTiles == 0) ? 2 : this.minTiles-1;
                this.maxTiles = (this.maxTiles == this.CHANNELS-1) ? 4 : this.maxTiles+1;
                this.SPAWN_DELAY = Math.max(1500,this.SPAWN_DELAY-10);
                this.spawnTimer.delay = this.SPAWN_DELAY;
                this.TILE_SPEED += 0.1;
            }
        });

        // GAME TIMER
        this.startTime = this.game.getTime();
        let scoreConfig = 
        {
            fontFamily: "Arial",
            fortSize: "40px",
            backgroundColor: "#ffffff",
            color: "#111111",
            align: "right",
            padding: 
            {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
	}

	update()
	{
        console.log((this.game.getTime() - this.startTime)/1000);

        // INPUT
        let rotationAmount = 0
        // handle left-right
        if (cursors.left.isDown) rotationAmount += -1;
        if (cursors.right.isDown) rotationAmount += 1;

        if (!this.runner.dead) {
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
        } else { // runner is dead, prompt reset
            if (esc.isDown) {
                this.scene.start("mainMenuScene");
            }
            if (spacebar.isDown) {
                this.scene.start("mainLevelScene");
            }
        }
    }

    spawnTiles() {
        // Spawns a round of new tiles!
        // ================
        
        let indices = this.generateIndices(this.minTiles, this.maxTiles, this.CHANNELS);
        if (indices.size == 0) return;

        this.sound.play("whoosh");
        for (const index of indices) {
            let tile = new Tile(this, game.config.width/2, game.config.height/2, this.KEY_TILE, 0,
                                this.tileParent, false, this.TILE_SPEED, this.CHANNELS, index).setDepth(this.TILE_DEPTH);
            tile.setActive(true).setVisible(true).setScale(0.1);
            this.tileParent.add(tile);
        }
    }

    generateIndices(minLength, maxLength, numberOfValues)
    {
        // Generates a list of random indices, where the number of indices is between minLength
        // and maxLength, and the indices themselves are between 0 and numberOfValues-1.
        // ================

        if (maxLength > numberOfValues) {
            maxLength = numberOfValues;
        }
        else {
            let targetLength = Math.floor((Math.random()*(maxLength-minLength+1))) + minLength;

            if (targetLength == numberOfValues) {
                // Return the set of all possible indices.
                return new Set(Array(numberOfValues).fill().map((element, index))); 
            }

            // Otherwise, generate random indices.
            let ourSet = new Set();
            while (ourSet.size < targetLength) {
                ourSet.add(Math.floor(Math.random() * (numberOfValues+1)));
            }
            return ourSet;
        }
    }

    handleCollision() {
        if (this.runner.invincible || this.runner.dead) {
            return;
        } else { // They aren't currently invincible. Mark them as such, so this function is only called once.
            this.runner.invincible = true;
            this.runner.setTint(0xff5555);
            this.runner.health--;

            // Update our hearts display.
            this.heartsDict[this.runner.health].setFrame(1).setAlpha(0.5).setTint(0xff5555);

            // Handle game over.
            if (this.runner.health == 0) {
                this.runner.dead = true;
                this.runner.play("dead");
                this.spawnTimer.destroy();
                console.log("GAME OVER.");
            }
        }

        this.playHurtNoise();

        this.time.addEvent({
            delay: this.INVINCIBILITY_TIME,
            loop: false,
            callbackScope: this,
            callback: () => {
                this.runner.invincible = false
                this.runner.setTint(0xffffff);
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