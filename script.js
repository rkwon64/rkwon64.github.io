const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 900;
canvas.height = 600;

//variables
const cellSize = 100;
const cellGap = 3;
const gameGrid = [];
const towers = [];
const enemies = [];
const enemyPositions = [];
const projectiles = [];
const resources = [];
//score to win
const winningScore = 1000;
//starting resources
let numberOfResources = 300;
//enemy wave spawn interval
let enemiesInterval = 500;
let frame = 0;
let gameOver = false;
let score = 0;
let chosenTower = 1;

//audio
const audioFiles = {
    shoot: new Audio('Shoot.mp3'),
    swordAttack: new Audio('Swordattack.mp3'),
    skeletonDeath: new Audio('Skeletondeath.mp3'),
    teaPickup: new Audio('tea.mp3'),
    placeTower: new Audio('place.mp3'),
    slash: new Audio('slash.mp3'),
 };
 
 audioFiles.shoot.volume = 0.7;
 audioFiles.swordAttack.volume = 0.5;
 audioFiles.teaPickup.volume = 0.7;
 audioFiles.slash.volume = 0.7;

for (let key in audioFiles) {
   audioFiles[key].load();
}
function playSound(audioKey) {
   if (audioFiles[audioKey]) {
       let sound = audioFiles[audioKey].cloneNode(); // Clone for multiple plays
       sound.play();
   }
}
//levels
//starting
let currentLevel = 1;
let gamePaused = true;
let levelTextDisplayed = true;

function showLevelText() {
   ctx.fillStyle = 'rgba(0,0,0, 0.8)';
   ctx.fillRect(50, 200, 800, 370);

   ctx.fillStyle = 'white';
   ctx.font = '20px Bebas Neue';
   ctx.textAlign = 'center';

   let message = "";

   if (currentLevel === 1) {
       message = "In this land, Tea was used as a currency and as a sacred offering to spirits\nIt is said that the tea leaves grown there hold mystical properties, keeping balance between living and dead.\nOne fateful night, the vengeful Lord broke the seal between the surface and the underground,\n causing swarms of the dead to rise from their graves\n Captivated by the power of the village's tea, The Lord led the undead army to attack the village\n to steal the tea Leaves and restore themselves to life\n Will you protect the village or will it be lost to the tide of undead? \n\nLevel 1: Click the moon to start!";
   } else if (currentLevel === 2) {
       message = "Good job! Here's a new troop to use! They don't attack and have weak health, but they produce tea!\n Tip: highly reccomended to place kunoichi first\nKunoichi unlocked!\nLevel 2: Click the moon to continue.";
   } else if (currentLevel === 3) {
       message = "The Lord is not happy, Another even stronger wave inbound! Reinforcements have arrived!\n Samurai are strong and alot of health, but are close range and cost 150 tea. \n tip:Samurai are very good at handling groups of enemies \nSamurai Unlocked!\nLevel 3: Click the moon to start!";
   } else if (currentLevel === 4) {
       message = "The Undead Armies Grow Much Stronger! \nThe Shogun has arrived to help quell the Undead!\nHis powerful Slash attack cleaves through his foes!\nTip: The Shogun is very strong against many enemies in a single lane \nShogun Unlocked!\nLevel 4: Click the moon to start!";
   } else if (currentLevel === 5) {
       message = "The Lord is Growing Furious, Beware his new Troop the Yokai! \nSmall and fragile, but Very Swift and Deadly!\n Tip: the yokai has very lethal damage so archers are the best way to deal with them\n Level 5: Click the moon to start!";""
   }  else if (currentLevel === 6) {
    message = "The evil lord is approaching!\n Tip: Beware his summon necromantic ability to raise the dead!\n Level 6: Click the moon to start!";""
    } else if (currentLevel === 7) {
        message = "You have slain the evil lord! \nThanks for Playing! Continue for endless levels! They will continously get harder.\n Endless Levels: Click the moon to start!";""
    }
   let lines = message.split("\n");

let x = canvas.width / 2;
let y = canvas.height / 2;
let lineHeight = 30; // Adjust spacing between lines

lines.forEach((line, index) => {
    
    if (line.includes("Level 1: Click the moon to start!")) {
        ctx.fillStyle = 'yellow';  
     } else if (line.includes("Kunoichi unlocked!")) {
        ctx.fillStyle = 'yellow';  
    } else if (line.includes("Samurai Unlocked!")) {
        ctx.fillStyle = 'orange';  
    } else if (line.includes("Shogun Unlocked!")) {
        ctx.fillStyle = 'red'; 
    } else if (line.includes("Level 5: Click the moon to start!")) {
        ctx.fillStyle = 'yellow'; 
    } else if (line.includes("Level 6: Click the moon to start!")) {
        ctx.fillStyle = 'red'; 
    } else if (line.includes("Endless Levels: Click the moon to start!")) {
        ctx.fillStyle = 'yellow'; 
    } else {
        ctx.fillStyle = 'white';  
    }

    ctx.fillText(line, x, y + index * lineHeight);
});

}
//game start
canvas.addEventListener("click", function() {
   if (gamePaused) {
       gamePaused = false;
       animate(); // Start the game
   }
});

//creates new level when completed
function nextLevelFunction() {
   if (gamePaused) return;
   currentLevel++;
   gamePaused = true;
   levelTextDisplayed = false;

   score = 0;
   gameOver = false;
   enemies.length = 0;
   towers.length = 0;
   projectiles.length = 0;
   resources.length = 0;
   enemyPositions.length = 0;
   enemiesInterval = 600; // Reset enemy interval
   numberOfResources = 300; // Give player new resources
   
   showLevelText();
   animate(); // Restart game loop
}
function TryAgainFunction() {
    if (gamePaused) return;
    gamePaused = true;
    levelTextDisplayed = false;
 
    score = 0;
    gameOver = false;
    enemies.length = 0;
    towers.length = 0;
    projectiles.length = 0;
    resources.length = 0;
    enemyPositions.length = 0;
    enemiesInterval = 600; // Reset enemy interval
    numberOfResources = 300; // Give player new resources
    
    showLevelText();
    animate(); // Restart game loop
 }

//mouse
const mouse = {
   x: 10,
   y: 10,
   width: 0.1,
   height: 0.1,
   clicked: false
}
canvas.addEventListener('mousedown', function(){
   mouse.clicked = true;
});
canvas.addEventListener('mouseup', function(){
   mouse.clicked = false;
});

let canvasPosition = canvas.getBoundingClientRect();
canvas.addEventListener('mousemove', function(e){
mouse.x = e.x - canvasPosition.left;
mouse.y = e.y - canvasPosition.top;
});
canvas.addEventListener('mouseleave', function(){
mouse.x = undefined;
mouse.y = undefined;
})

//board
const controlsBar = {
   width: canvas.width,
   height: cellSize,
}
class Cell {
   constructor(x,y){
       this.x = x;
       this.y = y;
       this.width = cellSize;
       this.height = cellSize;
   }
   draw(){
       if (mouse.x && mouse.y && collision(this,mouse)){
           ctx.strokeStyle = 'black';
           ctx.strokeRect(this.x, this.y, this.width, this.height);
       }
   }
}
function createGrid(){
   for (let y = cellSize;y < canvas.height; y+= cellSize){
       for (let x = 0; x < canvas.width; x += cellSize){
           gameGrid.push(new Cell(x, y));
       }
   }
}
createGrid();
function handleGameGrid(){
   for (let i = 0; i < gameGrid.length; i++){
       gameGrid[i].draw();
   }
}

//projectiles
const arrow = new Image();
arrow.src = 'Arrow.png';
const slash = new Image()
slash.src = 'Slash.gif';

class Projectile {
   constructor(x,y){
       this.x = x;
       this.y = y;
       this.width = 40;
       this.height = 40;
       //projectile power and speed 15 speed for 100fps 21 for 60fps
       this.power = 25;
       this.speed = 21;
       //arrow sound effect
       playSound('shoot')
   }
   update(){
       this.x += this.speed;
   }
   draw(){
       //ctx.fillStyle = 'black';
       ctx.beginPath();
       //ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2);
       ctx.fill();
       ctx.drawImage(arrow, this.x, this.y, this.width, this.height);
   }
}

class ShogunProjectile {
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        //projectile power and speed
        this.power = 1.5;
        this.speed = 3;
        //arrow sound effect
        playSound('slash')
    }
    update(){
        this.x += this.speed;
    }
    draw(){
        //ctx.fillStyle = 'black';
        ctx.beginPath();
        //ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2);
        ctx.fill();
        ctx.drawImage(slash, this.x, this.y, this.width, this.height);
    }
    Collision(enemies) {
        for (let j = 0; j < enemies.length; j++) {
            let enemy = enemies[j];
            if (enemy && collision(this, enemy)) {
                // Apply damage to the enemy
                enemy.health -= this.power; 
            }
        }
            }
 }

function handleProjectiles(){
   for (let i = 0; i < projectiles.length; i++){
    let projectile = projectiles[i];

       projectiles[i].update();
       projectiles[i].draw();

       if (projectile instanceof ShogunProjectile) {
        projectile.Collision(enemies); 
    } else {
        for (let j = 0; j < enemies.length; j++) {
            if (enemies[j] && collision(projectile, enemies[j])) {
                enemies[j].health -= projectile.power;
                projectiles.splice(i, 1);
                i--;
                break;
            }
        }
    }
    if (projectiles[i] && projectiles[i].x > canvas.width - cellSize) {
        projectiles.splice(i, 1);
    }
    }
}

//towers
const tower1 = new Image();
tower1.src = 'Archer.png';
const tower2 = new Image();
tower2.src = 'Swordman.png';
const tower3 = new Image();
tower3.src = 'Kunoichi.png';
const tower4 = new Image();
tower4.src = 'Shogun.png';


class Tower {
   constructor(x, y){
       this.x = x;
       this.y = y;
       this.width = cellSize - cellGap * 2;
       this.height = cellSize - cellGap * 2;
       this.shooting = false;
       this.shootNow = false;
       //default tower health
       this.health = 100;
       this.projectiles = [];
       this.timer = 0;
       this.frame = 0;
       this.frameX = 0;
       this.frameY = 0;
       this.spriteWidth = 128;
       this.spriteHeight = 128;
       this.minFrame = 0;
       this.maxFrame = 13;
       // Amount of tea produced every interval
       this.amountProduced = 10; 
       //frame interval
       this.productionInterval = 200;
       this.chosenTower = chosenTower;
       this.canFireProjectile = true;

         if (this.chosenTower === 1) {
           this.health = 100; // Archer health
       } else if (this.chosenTower === 2) {
           this.health = 200; // Swordsman health
       } else if (this.chosenTower === 3) {
           this.health = 50; // Kunoichi health
       } else if (this.chosenTower === 4) {
           this.health = 600; // Shogun health
       }

   }

   draw(){
      // ctx.fillStyle = 'blue';
      // ctx.fillRect(this.x, this.y, this.width, this.height);
       ctx.fillStyle = 'gold';
       ctx.font = '30px Bebas Neue';
       ctx.fillText(Math.floor(this.health), this.x + 15, this.y + 30);
       if (this.chosenTower === 1){
           ctx.drawImage(tower1, this.frameX * this.spriteWidth, 0, this.spriteWidth,
               this.spriteHeight, this.x, this.y, this.width, this.height);
       } else if (this.chosenTower === 2){
           ctx.drawImage(tower2, this.frameX * this.spriteWidth, 0, this.spriteWidth,
               this.spriteHeight, this.x, this.y, this.width, this.height);
       } else if (this.chosenTower === 3){ 
           ctx.drawImage(tower3, this.frameX * this.spriteWidth, 0, this.spriteWidth,
           this.spriteHeight, this.x, this.y, this.width, this.height);
        }else if (this.chosenTower === 4){ 
           ctx.drawImage(tower4, this.frameX * this.spriteWidth, 0, this.spriteWidth,
           this.spriteHeight, this.x, this.y, this.width, this.height);
           }
           
   }
   update(){
       //firerate 8 for 100fps 5 for 60fps 20 for 240fps
       if (frame % 5 === 0) {
           if (this.frameX < this.maxFrame) {
               this.frameX++;
           } else {
               this.frameX = this.minFrame;
           }
   
           //shoot archers at exactly frame 11 for animation
           if(this.chosenTower === 1) {
               if (this.frameX === 11) this.shootNow = true;
           }
       }
       //kunoichi tea production logic
       if (this.chosenTower === 3) {
           this.timer++; // Increment timer
           if (this.timer % this.productionInterval === 0) {
               numberOfResources += this.amountProduced;
               floatingMessages.push(new floatingMessage('+' + this.amountProduced, this.x, this.y, 30, 'green'));
               floatingMessages.push(new floatingMessage('+' + this.amountProduced, 500, 70, 20, 'gold'));
           }
       }
       //shooting animation for archers
       if(this.chosenTower === 1){
           if (this.shooting){
               this.minFrame = 0;
               this.maxFrame = 13;
           } else {
               this.minFrame = 14;
               this.maxFrame = 22;
       }

       //swordman logic
   } else if (this.chosenTower === 2){

       // Swordman attacks nearby enemies instead

       for (let j = 0; j < enemies.length; j++){
           let enemy = enemies[j];
           if (enemy && collision(this, enemy)){
               //swordsman dps
               enemy.health -= 0.31;
               this.shooting = true;
           } else {
               this.shooting = false;
           }
       }

        //Shogun logic
   } else if (this.chosenTower === 4){
    
    if (this.frameX === 14 && this.canFireProjectile) {  
        projectiles.push(new ShogunProjectile(this.x + 70, this.y + 36));
    this.canFireProjectile = false;
    }
    if (this.frameX === 1) {
    this.canFireProjectile = true;
    }

        
       for (let j = 0; j < enemies.length; j++){
           let enemy = enemies[j];
           if (enemy && collision(this, enemy)){
               //Shogun dps
               enemy.health -= 0.2;
               this.shooting = true;
           } else {
               this.shooting = false;
           }
       }
    }
   
       //arrow  projectile
       if (this.shooting && this.shootNow){
           if (this.timer % 100 === 0){
               projectiles.push(new Projectile(this.x + 70, this.y + 36));
               this.shootNow = false;
           }
       }
       }
}       


function handleTowers() {
    for (let i = towers.length - 1; i >= 0; i--) {
        let tower = towers[i];
        tower.draw();
        tower.update();
        
        let attacked = false;

        if (tower.chosenTower === 1) {
            tower.shooting = enemyPositions.includes(tower.y);
        } else if (tower.chosenTower === 2 || tower.chosenTower === 4) {
            handleMeleeTower(tower);
        }

        // Handle tower-enemy interactions
        for (let j = 0; j < enemies.length; j++) {
            let enemy = enemies[j];

            if (collision(tower, enemy)) {
                enemy.movement = 0;
                tower.health -= enemy.damage;
            }

            if (tower.health <= 0) {
                if (tower.chosenTower === 2 || tower.chosenTower === 4) {
                    if (tower.swordAttackSound) {
                        tower.swordAttackSound.pause();
                        tower.swordAttackSound.currentTime = 0;
                        enemy.movement = enemy.speed; 
                    }
                }
                towers.splice(i, 1);
                enemy.movement = enemy.speed; 
                break; 
            }
        }
    }
}

//melee tower logic
function handleMeleeTower(tower) {
    if (!tower.swordAttackSound) {
        tower.swordAttackSound = new Audio('Swordattack.mp3');
        tower.swordAttackSound.loop = true;
        tower.isSwordSoundPlaying = false;
    }

    let attacked = enemies.some(enemy => collision(tower, enemy));

    if (attacked) {
        if (!tower.isSwordSoundPlaying) {
            tower.swordAttackSound.play();
            tower.isSwordSoundPlaying = true;
        }
        tower.minFrame = tower.chosenTower === 2 ? 0 : 0;
        tower.maxFrame = tower.chosenTower === 2 ? 12 : 14;
    } else {
        if (tower.isSwordSoundPlaying) {
            tower.swordAttackSound.pause();
            tower.swordAttackSound.currentTime = 0;
            tower.isSwordSoundPlaying = false;
        }
        tower.minFrame = tower.chosenTower === 2 ? 13 : 15;
        tower.maxFrame = tower.chosenTower === 2 ? 18 : 19;
    }
    
    tower.shooting = attacked;
}



//tower cards
const card1 = {
   x: 10,
   y: 10,
   width: 70,
   height: 85
}
const card2 = {
   x: 90,
   y: 10,
   width: 70,
   height: 85
}
const card3 = {
   x: 170,
   y: 10,
   width: 70,
   height: 85
}
const card4 = {
   x: 250,
   y: 10,
   width: 70,
   height: 85
};

//tower selection
function chooseTower(){
   let card1stroke = 'white';
   let card2Stroke = 'white';
   let card3Stroke = 'white';
   let card4Stroke = 'white';

   if (collision(mouse, card1) && mouse.clicked){
       chosenTower = 1; //Archer
   } else if (collision(mouse, card2) && mouse.clicked && currentLevel >= 3) {  
       chosenTower = 2; // Swordman (unlocks at level 3)
   } else if (collision(mouse, card3) && mouse.clicked && currentLevel >= 2) {  
       chosenTower = 3; // Kunoichi (unlocks at level 2)
   }else if (collision(mouse, card4) && mouse.clicked && currentLevel >= 4) {  
       chosenTower = 4; // Shogun (unlocks at level 4)
   }
   if (chosenTower === 1) {
       card1stroke = 'gold';
   } else if (chosenTower === 2) {
       card2Stroke = 'gold';
   } else if (chosenTower === 3) {
       card3Stroke = 'gold';
   }else if (chosenTower === 4) {
       card4Stroke = 'gold';
   }

   ctx.lineWidth = 2;
   
   function drawCard(card, towerImage, price, strokeColor, isLocked) {
       ctx.fillStyle = 'rgba(0,0,0,0.2)';
       ctx.fillRect(card.x, card.y, card.width, card.height);

       ctx.strokeStyle = strokeColor;
       ctx.lineWidth = 2;
       ctx.strokeRect(card.x, card.y, card.width, card.height);

       ctx.drawImage(towerImage, 0, 0, 128, 128, card.x + 5, card.y + 5, 64, 64);

       ctx.fillStyle = isLocked ? 'red' : 'gold';
       ctx.font = '20px Bebas Neue';
       ctx.fillText(isLocked ? "LOCKED" : price, card.x + 35, card.y + 25);
   }

   drawCard(card1, tower1, '100', card1stroke, false);  // Archer 
   drawCard(card2, tower2, '150', card2Stroke, currentLevel < 3);  // Swordman (unlocks at Level 3)
   drawCard(card3, tower3, '75', card3Stroke, currentLevel < 2);  // Kunoichi (unlocks at Level 2)
   drawCard(card4, tower4, '400', card4Stroke, currentLevel < 4);  // Shogun (unlocks at Level 4)
}

//Floating Messages
const floatingMessages = [];
class floatingMessage {
   constructor(value, x, y, size, color){
       this.value = value;
       this.x = x;
       this.y = y;
       this.size = size;
       this.lifeSpan = 0;
       this.color = color;
       this.opacity = 1;
   }
   update(){
       this.y -= 0.3;
       this.lifeSpan += 1;
       if (this.opacity > 0.01) this.opacity -= 0.05;
   }
   draw(){
       ctx.globalAlpha = this.opacity;
       ctx.fillStyle = this.color;
       ctx.font = this.size + 'px Bebas Neue'
       ctx.fillText(this.value, this.x, this.y);
       ctx.globalAlpha = 1;
   }
}
function handleFloatingMessages(){
   for (let i = 0; i < floatingMessages.length; i++){
       floatingMessages[i].update();
       floatingMessages[i].draw();
       if (floatingMessages[i].lifeSpan >= 50){
           floatingMessages.splice(i, 1);
           i--;
       }
   }
}

//enemies
const enemyTypes = []
const enemy1 = new Image();
enemy1.src = 'SwordSkeletonWalk.png';
enemyTypes.push(enemy1);
const enemy2 = new Image();
enemy2.src = 'SpearSkeletonWalk.png';
enemyTypes.push(enemy2);
const enemy3 = new Image();
enemy3.src = 'crow.png';
enemyTypes.push(enemy3); 
const enemy4 = new Image();
enemy4.src = 'ring.png';
enemyTypes.push(enemy4);  
const bossImage = new Image();
bossImage.src = 'boss.png';
enemyTypes.push(bossImage);

const bossCastSound = new Audio('cast.mp3');
const bossSpawnSound = new Audio('enter.mp3');
const bossDeathSound = new Audio('death.mp3');
const bossMusicSound = new Audio('bossmusic.mp3');

class Enemy {
    constructor(verticalPosition, enemyIndex) {
        this.x = (enemyIndex === 0) ? canvas.width - 100 : canvas.width;
        this.y = verticalPosition;
        this.width = cellSize - cellGap * 2;
        this.height = cellSize - cellGap * 2;
        //default speeds 0.2 + 0.4 for 100fps 0.3 + 0.56 for 60fps
        this.speed = Math.random() * 0.3 + 0.56; 
        this.movement = this.speed;
 
        // Assign enemy type (could be the boss image as well)
        this.enemyType = enemyTypes[enemyIndex];

        // Default properties (Sword Skeleton)
        this.health = 100;
        this.damage = 0.2;
        this.maxHealth = this.health;
 
        // Unique enemy properties
        if (enemyIndex === 1) {  
            // Spear Skeleton
            this.health = 150;  
            this.damage = 0.3;
        } else if (enemyIndex === 2) {  
            // Crow 
            this.health = 400;  
            this.damage = 0.7; 
            //0.1 + 0.3 for 100fps 0.2 +0.4 for 60fps
            this.speed = Math.random() * 0.2 + 0.4; 
            this.movement = this.speed;
            this.size = 'large';
        } else if (enemyIndex === 3) {  
            // yokai
            this.health = 50; 
            this.damage = 2.5;  
            //.7 + .8 for 100 fps 0.98 + 1.12 for 60fps
            this.speed = Math.random() * .98 + 1.12; 
            this.movement = this.speed;
        } else if (enemyIndex === 4) {  // Boss
            this.health = 2000;
            this.damage = .7;
            this.maxHealth = this.health;
            this.isCasting = false;
            this.castTimer = 0;
            this.castDuration = 470;
            this.castCooldown = 300; // Cooldown before next cast
            this.lastCastTime = 0; // Tracks when last cast happened
            this.speed = 0.2; // Slow boss movement
        
            // Casting animation frames
            this.minCastFrame = 7; // Example frame start for casting
            this.maxCastFrame = 38; // Example frame end for casting

            this.lastHealth = this.health;
        }
 
        this.maxHealth = this.health;
 
        // Sprite properties
        this.frameX = 0;
        this.frameY = 0;
        this.minFrame = 0;
        this.maxFrame = 6;
        this.spriteWidth = 128;
        this.spriteHeight = 128;

        this.isFirstSpawn = true;  // Track if it's the first spawn
        this.firstSpawnFrames = [7, 8, 9, 10];  // Frames 7-10 for the first spawn
        this.firstSpawnIndex = 0;  // To track the current frame in first spawn animation
    }
 
    update() {

        if (this.enemyType === bossImage) {
            // Check if the boss has lost 250 health
            if (this.health <= this.lastHealth - 150) {
                // Move the boss to a random vertical lane
                this.moveToRandomLane();
                this.lastHealth = this.health; // Update the last health value after the move
            }
    
            if (this.isCasting) {
                this.movement = 0; // Stop moving while casting
                this.castTimer++;
        
                // Play casting animation 15 for 100fps 9 for 60fps
                if (frame % 9 === 0) { 
                    if (this.frameX < this.maxCastFrame) {
                        this.frameX++;
                    } else {
                        this.frameX = this.minCastFrame; // Loop within casting frames
                    }
                }
        
                if (this.castTimer >= this.castDuration) {
                    this.spawnSwordSkeletons();
                    this.isCasting = false;
                    this.castTimer = 0;
                    this.lastCastTime = frame; // Set cooldown timer
                    this.movement = this.speed; // Resume movement
                }
    
            } else {
                this.movement = this.speed;
                this.x -= this.movement;
        
                // Regular walking animation 15 for 100fps 9 for 60fps
                if (frame % 9 === 0) { 
                    if (this.frameX < this.maxFrame) {
                        this.frameX++;
                    } else {
                        this.frameX = this.minFrame;
                    }
                }
        
                // Boss casts at intervals (only if cooldown is over)
                if (Math.random() < 0.01 && (frame - this.lastCastTime > this.castCooldown)) {
                    this.isCasting = true;
                    this.frameX = this.minCastFrame; // Start casting animation
        
                    // **Play the casting sound when casting begins**
                    bossCastSound.currentTime = 0;  
                    bossCastSound.play();
                }
            }
        } else if (this.enemyType === enemy1) {  // Sword Skeleton
            if (this.isFirstSpawn) {
            
                // Play frames 7-10 once during the first spawn
                this.frameX = this.firstSpawnFrames[this.firstSpawnIndex];
                
                // Move to the next frame in the first spawn sequence
                if (frame % 9 === 0) {  // Ensure the animation progresses over time
                    this.firstSpawnIndex++;
                    if (this.firstSpawnIndex >= this.firstSpawnFrames.length) {
                        // After playing frames 7-10, transition to the regular animation
                        this.isFirstSpawn = false;
                        this.firstSpawnIndex = 0;  // Reset for future use
                    }
                }
            } else {
                // Regular walking animation (frames 0-6)
                this.x -= this.movement;
    
                if (frame % 9 === 0) {
                    if (this.frameX < this.maxFrame) {
                        this.frameX++;
                    } else {
                        this.frameX = this.minFrame;
                    }
                }
            }
            
        } else {
            // Regular enemy behavior for other types (such as Spear Skeleton, Crow, etc.)
            this.x -= this.movement;
        
            // Regular walking animation for other enemies
            if (frame % 9 === 0) {
                if (this.frameX < this.maxFrame) {
                    this.frameX++;  
                } else {
                    this.frameX = this.minFrame;
                }
            }
        }
    }
    
    moveToRandomLane() {
        // Define vertical lanes
        const lanePositions = [cellSize, 2 * cellSize, 3 * cellSize, 4 * cellSize, 5 * cellSize];
        // Pick a random lane
        this.y = lanePositions[Math.floor(Math.random() * lanePositions.length)];
    }

    draw() {
        ctx.fillStyle = 'white';
        ctx.font = '30px Bebas Neue';
        ctx.fillText(Math.floor(this.health), this.x + 15, this.y + 30);
    
        // Draw the enemy sprite
        ctx.drawImage(this.enemyType, this.frameX * this.spriteWidth, 0, this.spriteWidth, 
            this.spriteHeight, this.x, this.y, this.width, this.height);
    
        if (this.enemyType === bossImage && this.isCasting) {
            // Casting effect (red glow)
         //   ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
           // ctx.beginPath();
          //  ctx.arc(this.x + this.width / 2, this.y + this.height / 2, 50, 0, Math.PI * 2);
           // ctx.fill();
        }
    }
    

    spawnSwordSkeletons() {
        // Spawn multiple Sword Skeletons 
        for (let i = 0; i < 25; i++) {
            let verticalPosition = Math.floor(Math.random() * 5 + 1) * cellSize + cellGap;
            let newSkeleton = new Enemy(verticalPosition, 0); 
            enemies.push(newSkeleton);
            enemyPositions.push(verticalPosition);
        }
    }
}
let bossSpawned = false;

function handleEnemies() {
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].update();
        enemies[i].draw();

        //triger gameover
        if (enemies[i].x < 0) {
            gameOver = true;
        }
        if (enemies[i].health <= 0) {
            playSound('skeletonDeath');
            
            if (enemies[i].enemyType === enemyTypes[2]) {  // Crow is the third type in enemyTypes
                gainedResources = enemies[i].maxHealth / 20; // Adjusted reward for crows (e.g., divide by 10 instead of 5)
            } else {
                gainedResources = enemies[i].maxHealth / 5; // Default reward for other enemies
            }
            floatingMessages.push(new floatingMessage('+' + gainedResources, enemies[i].x, enemies[i].y, 30, 'white'));
            floatingMessages.push(new floatingMessage('+' + gainedResources, 500, 70, 20, 'gold'));
            numberOfResources += gainedResources;
            score += gainedResources;

            const findThisIndex = enemyPositions.indexOf(enemies[i].y);
            enemyPositions.splice(findThisIndex, 1);
            enemies.splice(i, 1);
            i--;
        }
    }

    // Check if boss should spawn at 10 points before the winning score
    if (currentLevel === 6 && !bossSpawned && score >= (winningScore - 10)) {
        let verticalPosition = Math.floor(Math.random() * 5 + 1) * cellSize + cellGap;
        enemies.push(new Enemy(verticalPosition, 4)); 
        //mute music for boss music
        backgroundMusic.muted = true; 

        bossSpawnSound.currentTime = 0;  
        bossSpawnSound.play();
        bossDeathSound.play();
        bossMusicSound.play();
        bossSpawned = true;

        bossMusicSound.addEventListener('ended', () => {
            backgroundMusic.muted = false; // Unmute the background music when the boss music ends
        });
    }

    // Calculate the spawn  based on how far the player is through the level
    let levelProgress = score / winningScore;  // Range: 0 to 1
    let earlySpawnFactor = Math.max(1 - levelProgress, 0.2);  // Slower spawn at the start, faster as you near winning score

    // Spawning new enemies logic
    if (frame % enemiesInterval === 0 && score < winningScore) {
        let verticalPosition = Math.floor(Math.random() * 5 + 1) * cellSize + cellGap;

        // Number of enemies to spawn: Increasing based on level progress
        let numberOfEnemiesToSpawn = Math.floor(Math.random() * 2) + 1 + Math.floor(levelProgress * 3); // Gradually more enemies

        // Logic for spawning enemies based on the current level and progress within the level
        for (let i = 0; i < numberOfEnemiesToSpawn; i++) {
            let randomValue = Math.random();
            let enemyIndex;

            // Adjust spawn behavior based on current level and progress within the level
            if (currentLevel >= 1 && currentLevel <= 2) {
                // Level 1 and 2: Only Sword Skeletons
                enemyIndex = 0; // Sword Skeleton
            } else if (currentLevel === 3) {
                if (randomValue < 0.8 - earlySpawnFactor * 0.3) {
                    enemyIndex = 0; // Sword Skeleton
                } else {
                    enemyIndex = 1; // Spear Skeleton
                }
            } else if (currentLevel === 4) {
                if (randomValue < 0.55 - earlySpawnFactor * 0.2) {
                    enemyIndex = 0; // Sword Skeleton
                } else if (randomValue < 0.75 - earlySpawnFactor * 0.15) {
                    enemyIndex = 1; // Spear Skeleton
                } else {
                    enemyIndex = (levelProgress >= 1 / 3) ? 2 : 0; // Crow starts at 1/3 into the level
                }
            } else if (currentLevel >= 6) {
                if (randomValue < 0.4 - earlySpawnFactor * 0.2) {
                    enemyIndex = 0; // Sword Skeleton
                } else if (randomValue < 0.6 - earlySpawnFactor * 0.15) {
                    enemyIndex = 1; // Spear Skeleton
                } else if (randomValue < 0.85 - earlySpawnFactor * 0.1) {
                    enemyIndex = (levelProgress >= 0.6) ? 2 : 0; // Crow starts at 60% into the level
                } else {
                    enemyIndex = (levelProgress >= .5) ? 3 : 0; // yokai starts at 50% into the level
                }

            }else if (currentLevel === 5) {
                if (randomValue < 0.6 - earlySpawnFactor * 0.25) {
                    enemyIndex = 0; // Sword Skeleton
                } else if (randomValue < 0.8 - earlySpawnFactor * 0.2) {
                    enemyIndex = 1; // Spear Skeleton
                } else if (randomValue < 0.95 - earlySpawnFactor * 0.1) {
                    enemyIndex = (levelProgress >= 0.6) ? 2 : 0; // Crow starts after 60% progress
                } else {
                    enemyIndex = (levelProgress >= 0.4) ? 3 : 0; // yokai starts after 40% progress
                }
            }
            
            // Spawn the chosen enemy
            let newEnemy = new Enemy(verticalPosition, enemyIndex);
            enemies.push(newEnemy);
            enemyPositions.push(verticalPosition);
        }

        // Adjust spawn interval to increase difficulty more gradually
        if (currentLevel <= 2) {
            enemiesInterval = Math.max(180, enemiesInterval - 20); // Slow spawn rate for early levels
        } else if (currentLevel <= 4) {
            enemiesInterval = Math.max(160, enemiesInterval - 20); // Slightly faster for mid game
        } else if (currentLevel <= 6) {
            enemiesInterval = Math.max(140, enemiesInterval - 20); // Slightly faster for later game
        } else if (currentLevel > 6) {
            enemiesInterval = Math.max(120, enemiesInterval - 25); // Even faster as the game progresses
        }
    }
}

//resources
const Tea = new Image();
Tea.src = 'Tea.png';

//tea drop amounts
const amounts = [20,25,30,35,40,45,50];
class Resource{
   constructor(){
       this.x = Math.random() * (canvas.width - cellSize);
       this.y = (Math.floor(Math.random() * 5) + 1) * cellSize + 25;
       this.width = cellSize * 0.6;
       this.height = cellSize * 0.6;
       this.amount = amounts[Math.floor(Math.random() * amounts.length)]
       this.frameX = 0;
       this.frameY = 0;
       this.minFrame = 0;
       this.maxFrame = 3;
       this.spriteWidth = 128;
       this.spriteHeight = 128;
   }
   update(){
    // 15 for 100fps 9 for 60fps
       if(frame % 9 === 0){
       if (this.frameX < this.maxFrame) this.frameX++;
       else this.frameX = this.minFrame;
   }
}
   draw(){
       //ctx.fillStyle = 'yellow';
       //ctx.fillRect(this.x, this.y, this.width, this.height);
       ctx.fillStyle = 'white';
       ctx.font = '20px Bebas Neue';
       ctx.fillText(this.amount, this.x + 5, this.y +20);
       ctx.drawImage(Tea, this.frameX * this.spriteWidth, 0, this.spriteWidth, 
           this.spriteHeight, this.x, this.y, this.width, this.height);
   }
}

function handleResources(){
   if(frame % 500 === 0 && score < winningScore){
       resources.push(new Resource);
   }
   for (let i = 0; i < resources.length; i++){
       resources[i].draw();
       if (resources[i] && mouse.x && mouse.y && collision(resources[i],mouse)){
           playSound('teaPickup');
           numberOfResources += resources[i].amount;
           floatingMessages.push(new floatingMessage('+' + resources[i].amount, resources[i].x, resources[i].y, 30, 'white'));
           floatingMessages.push(new floatingMessage('+' + resources[i].amount, 500, 70, 20, 'gold'));
           resources.splice(i,1);
           i--;
       }
   }
}

//utilities
function handleGameStatus() {
    //Hud elements
    ctx.fillStyle = 'gold';
    ctx.font = '30px Bebas Neue';
    ctx.fillText('Score: ' + score, 400, 40);
    ctx.fillText('Tea: ' + numberOfResources, 400, 75);
    ctx.fillText('Level: ' + currentLevel, 800, 40);

    //lose senario logic
    if (gameOver) {
        ctx.fillStyle = 'red';
        ctx.font = '60px Bebas Neue';
        ctx.fillText('GAME OVER Click to Try Again', 450, 330);
        canvas.addEventListener("click", tryAgainHandler);

        stopAllSounds(); // Call this function when game is lost
        function stopAllSounds() {
            for (let i = 0; i < towers.length; i++) {
                if (towers[i].swordAttackSound) {
                    towers[i].swordAttackSound.pause();
                    towers[i].swordAttackSound.currentTime = 0;
                    towers[i].isSwordSoundPlaying = false;
                }
            }
        }

        //win senario logic
    } else if (score >= winningScore && enemies.length === 0) {
        ctx.fillStyle = 'white';
        ctx.font = '60px Bebas Neue';
        ctx.fillText('LEVEL COMPLETE', 450, 300);
        ctx.font = '30px Bebas Neue';
        ctx.fillText('You win with ' + score + ' points! Click for Next Level', 450, 340);
        canvas.addEventListener("click", nextLevelHandler);
    }
}

// Separate event handler functions
function tryAgainHandler(event) {
    canvas.removeEventListener("click", tryAgainHandler);
    TryAgainFunction();
}

function nextLevelHandler(event) {
    canvas.removeEventListener("click", nextLevelHandler);
    nextLevelFunction();
}
canvas.addEventListener('click', function(){
   const gridPositionX = mouse.x - (mouse.x % cellSize) + cellGap;
   const gridPositionY = mouse.y - (mouse.y % cellSize) + cellGap;
   if (gridPositionY < cellSize) return;

   //prevent towers to be placed on eachother
   for (let i = 0; i < towers.length; i++){
       if (towers[i].x === gridPositionX && towers[i].y === gridPositionY)
          return;
   }
   //default tower cost
   let towerCost = 0;
   if (chosenTower === 1) {
       towerCost = 100; // Archer cost
   } else if (chosenTower === 2) {
       towerCost = 150; // Swordsman cost 
   } else if (chosenTower === 3) {
       towerCost = 75; // Kunoichi cost 
   } else if (chosenTower === 4) {
       towerCost = 400; // Shogun cost 
   }
   if (numberOfResources >= towerCost){
       towers.push(new Tower(gridPositionX, gridPositionY));
       numberOfResources -= towerCost;
       //playSound('place')
   } else{
       floatingMessages.push(new floatingMessage('need more tea', mouse.x, mouse.y, 25, 'white'));
   }
});

function animate(){
   ctx.clearRect(0,0,canvas.width,canvas.height);

   //pauses game 
   if (gamePaused) {
       showLevelText();
       return;
   }

   //ctx.fillStyle = 'blue';
   //ctx.fillRect(0,0,controlsBar.width, controlsBar.height);
   handleGameGrid();
   handleTowers();
   handleResources();
   handleProjectiles();
   handleEnemies();
   chooseTower();
   handleGameStatus();
   handleFloatingMessages();
   frame++;
   if (!gameOver) requestAnimationFrame(animate);
}
animate();
//collision function
function collision(first, second){
   if (    !( first.x > second.x + second.width ||
              first.x + first.width < second.x ||
              first.y > second.y + second.height ||
              first.y + first.height < second.y)
   )  {
        return true;
   };
};
//window resize funcion
window.addEventListener('resize', function(){
   canvasPosition = canvas.getBoundingClientRect();
})