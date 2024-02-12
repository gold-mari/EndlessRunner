class Tile extends Phaser.GameObjects.Sprite
{
    constructor(scene, x, y, texture, frame, group, traversable, moveSpeed, numberOfChannels, ourChannel)
    {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);                       // add to existing scene
        scene.physics.add.existing(this);               // add to physics
        this.scene = scene;

        this.group = group;

        this.traversable = traversable;
        if (traversable) {
            this.setTint(0xFFFFFF)
        }
        else {
            this.setTint(0xFF0000)
        }

        this.moveSpeed = moveSpeed;
        this.numberOfChannels = numberOfChannels;
        this.ourChannel = ourChannel;

        this.distanceFromCenter = 0;
        this.currentAngle = 0;
        this.center = new Phaser.Math.Vector2(x,y);
    }

    update(angle)
    {
        // move out
        this.distanceFromCenter += this.moveSpeed;
        this.currentAngle = angle + (360 * this.ourChannel / this.numberOfChannels);
        this.angle = this.currentAngle - 90;

        this.setScale(1.325*this.distanceFromCenter/game.config.height);
        this.moveSpeed += 0.05;
        this.body.setSize(60,60);

        let angleRadians = Math.PI * this.currentAngle / 180;

        this.x = this.center.x + (this.distanceFromCenter * Math.cos(angleRadians));
        this.y = this.center.y + (this.distanceFromCenter * Math.sin(angleRadians));

        // simple out-of-bounds check
        if (this.body.checkWorldBounds())
        {
            this.group.remove(this, true, true)
        }
    }
}