let regShip = {
    texture: 'spaceship1',
    pointVal: Math.floor(Math.random() * (40 - 10) + 10),
    moveSpdMod: 0
};
let specShip = {
    texture: 'spaceship2',
    pointVal: 60,
    moveSpdMod: 1
};
let sfxArr = ['sfx_explosion1', 'sfx_explosion2', 'sfx_explosion3', 'sfx_explosion4'];
let hitCount = 0;
class Play extends Phaser.Scene{
    constructor(){
        super("playScene");
    }
    preload(){
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship1', './assets/spaceship1.png');
        this.load.image('spaceship2', './assets/spaceship2.png');
        this.load.image('starfield', './assets/starfield.png');
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 4});
    }
    create(){
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        // add spaceships (x3)
        let curShip = this.getRandomShip([regShip, specShip]);
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 0, curShip).setOrigin(0, 0);
        curShip = this.getRandomShip([regShip, specShip]);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 0, curShip).setOrigin(0,0);
        curShip = this.getRandomShip([regShip, specShip]);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 0, curShip).setOrigin(0,0);
        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
        // define keys
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 4, first: 0}),
            frameRate: 30
        });
        this.p1Score = 0;
        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);
        // game over flag 
        this.gameOver = false;
        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
        // clock display 
        this.timeLeft = 0;
        this.clockDisplay = this.add.text(borderPadding*50 + borderUISize, borderUISize + borderPadding*2, this.timeLeft, scoreConfig)
    }
    update(){
        //update clock
        let secMod = this.clock.elapsed - (this.clock.elapsed % 1000);
        this.timeLeft = (this.clock.delay - secMod) / 1000;
        this.clockDisplay.text = this.timeLeft;
        // define mouse for reading inputs
        let mouse = this.input.activePointer;
        // the variable clicked is essentially a flag that tells
        // rocket.update() if the left mouse was clicked
        let clicked = false;
        // return value of update() is stored in missed
        // if the rocket reached the green UI border then it missed
        // if it did not then we can assume that it hit a spaceship
        let missed;
        if(mouse.leftButtonDown()){
            clicked = true;
        }
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)){
            this.scene.restart();
        }
        this.starfield.tilePositionX -= 4;
        if(!this.gameOver){
            missed = this.p1Rocket.update(clicked);
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
        }
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
            let newShip = this.getRandomShip([regShip, specShip]);
            this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 0, newShip).setOrigin(0,0);
            hitCount += 1;
            missed = false;
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
            let newShip = this.getRandomShip([regShip, specShip]);
            this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 0, newShip).setOrigin(0,0);
            hitCount += 1;
            missed = false;
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
            let newShip = this.getRandomShip([regShip, specShip]);
            this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 0, newShip).setOrigin(0, 0);
            hitCount += 1;
            missed = false;
        }
        // if missed is false meaning that a collision was detected
        // and the hitcount % 3 == 0 then when add one second to the game clock
        if(missed == false){
            if(hitCount % 2 == 0 && hitCount > 0){
                this.clock.delay += 1000;
            }
        }
        // if the player missed then we set this successive hit counter to 0
        else if(missed){
            hitCount = 0;
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }
    }
    // getRandomShip() randomly chooses a ship based on the provided array
    // it also calculates the point value of the regular ship and returns
    // the randomly selected ship
    getRandomShip(shipArr) {
        let selShip = shipArr[Math.floor(Math.random() * shipArr.length)];
        if(selShip == regShip){
            selShip.pointVal = Math.floor(Math.random() * (40 - 10) + 10);
            selShip.pointVal -= selShip.pointVal % 10;
        }
        return selShip;
    }
    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }
    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
            ship.reset();                       // reset ship position
            ship.alpha = 1;                     // make ship visible again
            boom.destroy();                     // remove explosion sprite
        });
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        let sfx_explode_sound = sfxArr[Math.floor(Math.random() * sfxArr.length)]; // choose random sound from array of sfx
        this.sound.play(sfx_explode_sound);
    }
}