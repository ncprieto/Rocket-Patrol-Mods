class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, frame, shipCont){
        super(scene, x, y, shipCont.texture, frame);
        scene.add.existing(this);
        shipCont.pointVal -= shipCont.pointVal % 10;
        this.points = shipCont.pointVal;
        this.moveSpeed = game.settings.spaceshipSpeed + shipCont.moveSpdMod;
    }
    update(){
        this.x -= this.moveSpeed;
        if(this.x <= 0 - this.width){
            this.reset();
        }
    }
    reset(){
        this.x = game.config.width + borderPadding + this.width;
    }
}