class Tile extends Phaser.GameObjects.Sprite
{
    constructor(scene, x, y, texture, frame, traversable, numberOfChannels, ourChannel, speed)
    {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);                       // add to existing scene
        scene.physics.add.existing(this);               // add to physics
        this.scene = scene;
        this.traversable = traversable;
        this.moveSpeed = speed;
        this.numberOfChannels = numberOfChannels;
        this.ourChannel = ourChannel;
        this.group = undefined;

        this.distanceFromCenter = 0;
        this.currentAngle = 0;
        this.center = new Phaser.Math.Vector2(x,y);
    }

    setGroup(group)
    {
        this.group = group;
    }

    update(angle)
    {
        // move out
        this.distanceFromCenter += this.moveSpeed;
        this.currentAngle = angle + (360 * this.ourChannel / this.numberOfChannels);

        let angleRadians = Math.PI * this.currentAngle / 180;

        this.x = this.center.x + (this.distanceFromCenter * Math.cos(angleRadians));
        this.y = this.center.y + (this.distanceFromCenter * Math.sin(angleRadians));

        this.angle = angle;

        // simple out-of-bounds check
        // if (!Phaser.Geom.Rectangle.Contains(this.scene.cameras.main.getBounds, this.x, this.y))
        // {
        //     if (this.group != undefined) {
        //         console.log("removed!");
        //         this.group.remove(this, true, true);
        //     }
        //     else {
        //         console.log("destroyed!");
        //         this.destroy();
        //     }
        // }
        // else
        // {
        //     console.log("not out of bounds");
        // }
    }
}