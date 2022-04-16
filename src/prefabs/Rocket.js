// Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
      super(scene, x, y, texture, frame);
  
      // add object to existing scene
      scene.add.existing(this);
      this.isFiring = false;
      this.moveSpeed = 2;
      this.sfxRocket = scene.sound.add('sfx_rocket');
    }
    update(clicked){
      if(!this.isFiring){
        if(game.input.mousePointer.x <= borderUISize + this.width){
          this.x = borderUISize + this.width;
        }
        else if(game.input.mousePointer.x >= game.config.width - borderUISize - this.width){
          this.x = game.config.width - borderUISize - this.width;
        }
        else{
          this.x = game.input.mousePointer.x;
        }
      }
      if(clicked){
        this.isFiring = true;
        this.sfxRocket.play();
      }
      if(this.isFiring && this.y >= borderUISize * 3 + borderPadding){
        this.y -= this.moveSpeed;
      }
      if(this.y <= borderUISize * 3 + borderPadding){
        this.isFiring = false;
        this.y = game.config.height - borderUISize - borderPadding;
      }
    }
    reset(){
      this.isFiring = false;
      this.y = game.config.height - borderUISize - borderPadding;
    }
  }