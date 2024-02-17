// CMPM 120, Winter 2024
// Dylan Mahler - Endless Runner
// Bill Got Stuck in the INFINITE OCTAGON HALLWAY, Sucks to be Him! <3
// Development time: ~25 hours
// ================
// Notes on creative tilt:
// 1.   My endless runner takes place in pseudo-3D space, where the player seemingly runs around a tunnel
//      and dodges holes. In reality, the 3D effect is accomplished using careful scaling and positioning
//      of the 'hole' sprites to mimic them approaching the viewer. In order for all tiles to move in unison,
//      I had to use trigonometry, and learned about sprite groups so that I could apply the rotations to all
//      sprites in unison. See Tile.js and the ROTATION ==== section of MainLevel.js's update().
// 2.   I made all the art and sound for my game by hand, and I'm proud of it all! I think the minimalist
//      visual style lends itself nicely to the geometric nature of my pseudo-3D space. The rather maximalist
//      audio design, with the acid bass background track and the bitcrushed voice acting, contrasts in a way
//      I found funny, haha. Also, that name has to count for something, right? ;3
// ================

"use strict"

let config = {
    parent: 'phaser-game',  // for info text
    type: Phaser.WEBGL,     // for tinting
    width: 1152,
    height: 648,
    render: {
        pixelArt: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    scene: [ MainMenu, MainLevel ]
}

let game = new Phaser.Game(config)

let cursors
let esc
let spacebar
let { height, width } = game.config