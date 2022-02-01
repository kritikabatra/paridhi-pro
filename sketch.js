var PLAY = 1;
var END = 0;
var gameState = PLAY;

var Rohan, Rohan_running, Rohan_collided;
var ground, invisibleGround, groundImage;

var BirdsGroup, BirdImage;
var StoneGroup, Stone1, Stone2, Stone3, Stone4;
var Animal,gorilla;
var backgroundImg;
var score=0;

var gameOver, restart;


function preload(){
  
  backgroundImg = loadImage("background.png")
  BirdAnimation = loadAnimation("bird2.png","bird3.png");
  
  Rohan_running = loadAnimation("Runner1.png","Runner2.png","Runner3.png","Runner4.png");
  Rohan_collided = loadImage("runnercollide.png");
  Rohan_collided.scale = 0.5;
  
  Animal_running = loadImage("gorilla.png");

    Stone1 = loadImage("Stone1.png");
  Stone2 = loadImage("Stone2.png");
  Stone3 = loadImage("Stone3.png");
  Stone4 = loadImage("Stone4.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  bg = createSprite(windowWidth/2,windowHeight/2,width,height*2);
  bg.addImage(backgroundImg);
  bg.scale = 2;
  
  Rohan = createSprite(280,height-30,20,50);
  Rohan.addAnimation("running", Rohan_running);
  Rohan.addAnimation("collided",Rohan_collided);
  Rohan.setCollider('rectangle',0,0,120,270)
  Rohan.scale = 0.5;
  Rohan.debug=true
  
  //gorilla = createSprite(80,590,20,50);
  //gorilla.addImage("Running",Animal_running);
  //gorilla.scale = 0.4;

  invisibleGround = createSprite(width/2,height-25,width,20);  
  invisibleGround.shapeColor = "#f4cbaa";
  invisibleGround.visible = false

   gameOver = createSprite(width/2,height/2-50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
 
  // invisibleGround.visible =false

  BirdsGroup = new Group();
  StoneGroup = new Group();
  
  score = 0;
}

function draw() {
  //Rohan.debug = true;
  background("White");
  textSize(20);
  fill("black")
  text("Score: "+ score,30,50);
  
  Rohan.collide(invisibleGround);

  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
   bg.velocityX = -(6 + 3*score/100);
    
    if((touches.length > 0 || keyDown("SPACE")) && Rohan.y  >= height-150) {
      Rohan.velocityY = -10;
       touches = [];
    }
    
    Rohan.velocityY = Rohan.velocityY + 0.8
  
    if (bg.x < 0){
      bg.x = width/2;
    }
  
    spawnbirds();
    spawnstones();
  
    if(StoneGroup.isTouching(Rohan)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    bg.velocityX = 0;
    Rohan.velocityY = 0;
    StoneGroup.setVelocityXEach(0);
    BirdsGroup.setVelocityXEach(0);
    
    //change the Rohan animation
    Rohan.changeAnimation("collided",Rohan_collided);
    Rohan.scale = 0.30;
    //set lifetime of the game objects so that they are never destroyed
    StoneGroup.setLifetimeEach(-1);
    BirdsGroup.setLifetimeEach(-1);
    
    if(touches.length>0 || keyDown("SPACE")) {      
      reset();
      touches = []
    }
  }
  
  
  drawSprites();
}

function spawnbirds() {
  //write code here to spawn the bird
  if (frameCount % 60 === 0) {
    var bird = createSprite(width+20,height-300,40,10);
    bird.y = Math.round(random(100,220));
    bird.addAnimation("BirdAnimation",BirdAnimation);
    bird.scale = 0.5;
    bird.velocityX = -6;
    
     //assign lifetime to the variable
     bird.lifetime = width/6;
    
    //adjust the depth
    bird.depth = Rohan.depth;
    Rohan.depth = Rohan.depth+1;
    
    //add each cloud to the group
    BirdsGroup.add(bird);
  }
  
}

function spawnstones() {
  if(frameCount % 100 === 0) {
    var Stone = createSprite(width,height-60,20,30);
    Stone.setCollider('circle',0,0,45)
    // Stone.debug = true
  
    Stone.velocityX = -(6 + 3*score/100);
    
    //generate random Stone
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: Stone.addImage(Stone1);
              break;
      case 2: Stone.addImage(Stone2);
              break;
      case 3: Stone.addImage(Stone3);
              break;
      case 4: Stone.addImage(Stone4);
              break;       
      default: break;
    }
    
    //assign scale and lifetime to the Stone           
    Stone.scale = 0.3;
    Stone.lifetime = 300;
    Stone.depth = Rohan.depth;
    Rohan.depth +=1;
    //add each obstacle to the group
    StoneGroup.add(Stone);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  StoneGroup.destroyEach();
  birdsGroup.destroyEach();
  
  Rohan.changeAnimation("running",Rohan_running);
  
  score = 0;
  
}
