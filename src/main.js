// Notes go here

"use strict"

let config = {
    parent: "phaser-game",
    type: Phaser.AUTO,
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
let { height, width } = game.config