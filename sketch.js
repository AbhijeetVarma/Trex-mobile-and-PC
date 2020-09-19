
localStorage["HighestScore"] = 0;



var jumpSound, dieSound , checkpointSound 
var speed = -6


var PLAY = 1;
var END = 0;
var gameState = PLAY;

var gameOver , restart , gameOverI , restartI

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloud, cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverI = loadImage("gameOver.png");
   restartI = loadImage("restart.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
 checkpointSound = loadSound("checkPoint.mp3");
  
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  
  trex.scale = 0.5;
  
  ground = createSprite(width/2,height-80,width,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = speed;
  
  invisibleGround = createSprite(width/2,height-70,width,10);
  invisibleGround.visible = false;
  restart = createSprite(width/2,height/2);
  restart.addImage("r",restartI);
  gameOver = createSprite(width/2,height/2 - 50);
  gameOver.addImage("gO",gameOverI);
  restart.scale = 0.5
  gameOver.scale = 0.5
  restart.visible=false;
  gameOver.visible=false;
  
  // create Obstacles and Cloud groups
  obstaclesGroup = new Group();
  CloudsGroup = new Group();
  
  console.log("Hello" + 5);
  
  score = 0;
}

function draw() {
  background(200);
  text("Score: "+ score, width/2-50,height/2-150);
  text("Highest Score: "+ localStorage["HighestScore"], width/2-70,height/2-100);

  trex.setCollider("circle",0,0,50);
  
  if(gameState === PLAY){
      if(keyDown("space") ||  touches.length >0 && trex.y >= height-100) {
        trex.velocityY = -13;  
        jumpSound.play()
        touches = []
      }
    trex.velocityY = trex.velocityY + 0.8
    
    score = score + Math.round(getFrameRate()/60);
    speed = -(6+2*score/100)
    ground.velocityX = speed;
    spawnClouds();
    spawnObstacles();
    
    if(score%100 === 0 && score> 10){
       
       checkpointSound.play()
    
       }
  
    if(trex.isTouching(obstaclesGroup)){
       gameState = END;
      trex.changeAnimation("collided",trex_collided);
      dieSound.play()
       }
    
  }
  else if(gameState === END){
   
    ground.velocityX = 0;
    CloudsGroup.setVelocityXEach (0)
    obstaclesGroup.setVelocityXEach (0)
    obstaclesGroup.setLifetimeEach (-1)
    CloudsGroup.setLifetimeEach (-1)
    trex.velocityY=0;
    restart.visible=true;
    gameOver.visible=true;
    if(mousePressedOver(restart) || touches.length > 0){
       reset()
      touches= []
       }
    
  
  }
  
  
  
  
  
  if (ground.x < 0){
    ground.x = ground.width/2;
  }
  
  trex.collide(invisibleGround);
  
  //spawn the clouds
  
  
  //spawn obstacles on the ground
  
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width+10,height-90,10,40);
   obstacle.velocityX = speed;

   
    // //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = width/speed;
   
   //adding obstacles to the group
   obstaclesGroup.add(obstacle);
 }
}




function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
     cloud = createSprite(width+10,100,40,10);
    cloud.y = Math.round(random(height-190,height-140));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = speed;
    
     //assign lifetime to the variable
    cloud.lifetime = width/speed;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   CloudsGroup.add(cloud);
  }
  
}


function reset (){
  
  trex.changeAnimation("running",trex_running);
  gameState = PLAY;
  obstaclesGroup.destroyEach();
  CloudsGroup.destroyEach();

  restart.visible=false;
  gameOver.visible=false;
  speed = -6;
  
  if(localStorage["HighestScore"] < score){
     localStorage["HighestScore"] = score;
     
     }
  console.log(localStorage["HighestScore"]);
    score = 0
}


