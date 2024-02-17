// Notes go here

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