// Notes go here

"use strict"

let config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
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
let { height, width } = game.config