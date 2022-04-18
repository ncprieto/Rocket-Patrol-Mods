// Nathan Prieto
// Rocket Patrol Mods
// 4/17/2022
// This project took about 11 hours to complete
// Implemented mouse movement along with left click for fire (20)
// Added new assets for the rocket, spaceship, and explosions (20)
// Added a new spaceship type that moves faster and has different graphics (20)
// Implemeted scoring/timing mechanism that adds one second to the 
// clock after each third successive hit (20)
// Added 4 new explosion sfx that randomly play on collisions (10)
// Added clock display that shows the reamining seconds (10)
let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [Menu, Play]
}

let game = new Phaser.Game(config);

let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT;
// hi hello