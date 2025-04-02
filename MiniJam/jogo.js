// Alunos: Gabriel Baczinski, Afonso Muller e João Guilherme Camargo

let obstacles = [];
let items = [];
let score = 0;
let gameOver = false;
let gamePaused = false;
let gameStarted = true;
let targetHealthWidth = 200;
let currentHealthWidth = 200;
let bgY = 0;
let bgImage;
let healthImage;
let smallImage;
let bigImage;
let speedImage;
let logoImage;
let invertedImage;
let slowImage;
let commumImage;
let naveImage;
let objtImage;
let objt2Image;
let orbImage;
let startTime;
let gameMusic;
let currentTime;
let pixelFont;
let scale = 1.0;
let growing = true;
let fireParticles = [];
let bullets = [];
let x, y, diameter;
let pointsFromItems = 0;
let effectMessage = ""; 
let effectEndTime = 0;
let lastShotFrame = 0; 
let shotCooldownFrames = 30; 

function setup() {
  createCanvas(500, 500);
  player = new Player();
  startTime = Date.now();
  x = width / 2;
  y = height / 2;
  diameter = 50;
  userStartAudio();
  gameMusic.setLoop(true);
  gameMusic.play();
}

function preload() {
  bgImage = loadImage('bg.png');
  healthImage = loadImage('health.png');
  smallImage = loadImage('smaller.png');
  bigImage = loadImage('bigger.png');
  speedImage = loadImage('speed.png');
  logoImage = loadImage('logo.png');
  invertedImage = loadImage('inverted.png');
  slowImage = loadImage('slow.png');
  commumImage = loadImage('commum.png');
  naveImage = loadImage('nave.png');
  objtImage = loadImage('asteroid.png');
  objt2Image = loadImage('meteoro2.png');
  pixelFont = loadFont('PressStart2P-Regular.ttf');
  fogoImage = loadImage('fogo.png');
  orbImage = loadImage('orb.png');
  gameMusic = loadSound('GalacticGlow.mp3')
}

function draw() {
  background(0);

  image(bgImage, 0, bgY, width, height);
  image(bgImage, 0, bgY - height, width, height);

  bgY += 2;

  if (bgY >= height) {
    bgY = 0;
  }

  if (gameStarted) {
    let newWidth = width * scale;
    let newHeight = height * scale;
    let x = (width - newWidth) / 2;
    let y = (height - newHeight) / 2;

    image(logoImage, x, y, newWidth, newHeight);
    textSize(15);
    fill(255);
    textFont(pixelFont);
    textAlign(CENTER, CENTER);
    push();
    if (frameCount % 60 < 30) {
      fill(255);
      text("Pressione SPACE para começar", width / 2, height / 2 + 150);
    }
    pop();
    return;
  }

  if (gamePaused) {
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("JOGO PAUSADO", width / 2, height / 2);
    return;
  }

  if (gameOver) {
    textSize(25);
    fill(255);
    textAlign(CENTER);
    text('Game Over!', width / 2, height / 2 - 50);
    text('Final Score: ' + score, width / 2, height / 2);
    let totalSeconds = Math.floor(currentTime / 1000);
  let totalMinutes = Math.floor(totalSeconds / 60);
  totalSeconds = totalSeconds % 60;

  text('Tempo Total: ' + nf(totalMinutes, 2) + ':' + nf(totalSeconds, 2), width / 2, height / 2 + 50);
    push();
    if (frameCount % 60 < 30) {
      fill(255);
      textSize(12);
      text("Pressione SPACE para recomeçar", width / 2, height / 2 + 150);
    }
    pop();
    return;
  }

  currentTime = Date.now() - startTime;
  let seconds = Math.floor(currentTime / 1000);
  let minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;

  let timeScore = seconds + minutes * 100;

  fill(255);
  textSize(10);
  textAlign(LEFT, TOP);
  text("Tempo: " + nf(minutes, 2) + ":" + nf(seconds, 2), 10, 15);

  player.update();
  player.show();

  if (frameCount % 60 === 0) {
    obstacles.push(new Obstacle());
    obstacles.push(new Obstacle());
    items.push(new Item());
  }

  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].update();
    obstacles[i].show();

    if (obstacles[i].collides(player)) {
      takeDamage(10);
      obstacles[i].hasDamaged = true;
      obstacles[i].offScreen();
      obstacles.splice(i, 1);
    }
  }

  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].y -= bullets[i].speed; 
    image(fogoImage, bullets[i].x - 14, bullets[i].y - 5, 30, 30); 
  
    if (bullets[i].y < 0) {
      bullets.splice(i, 1);
      continue;
    }
  
    for (let j = obstacles.length - 1; j >= 0; j--) {
      let distance = dist(bullets[i].x, bullets[i].y, obstacles[j].x, obstacles[j].y);
      let collisionDistance = (bullets[i].diameter / 2) + (obstacles[j].size / 2);
  
      if (distance < collisionDistance) {
        obstacles.splice(j, 1);
        bullets.splice(i, 1);
        pointsFromItems += 5;  
        break; 
      }
    }
  }

  for (let i = items.length - 1; i >= 0; i--) {
    items[i].update();
    items[i].show();

    if (items[i].collides(player)) {
      items[i].applyEffect(player);
      pointsFromItems++; 
      items.splice(i, 1);
    }

    if (items[i].offScreen()) {
      items.splice(i, 1);
    }

    if (frameCount < effectEndTime) {
      push();
      if (frameCount % 60 < 30) {
      textSize(10);
      fill(255);
      textFont(pixelFont);
      textAlign(CENTER, CENTER);
      text(effectMessage, width / 2, height / 2 + 200);
      pop();
    }
    }
  }
  

  score = timeScore + pointsFromItems;

  fill(255);
  textSize(10);
  text('Score: ' + score, 380, 15);

  showHealthBar();
}

function keyPressed() {
  if (keyCode === ESCAPE) {
    gamePaused = !gamePaused;
  }
  if (keyCode === 32) {
    gameStarted = false; 
  }
  if (keyCode === 32 && gameOver) {
    resetGame(); 
  }
}

class Player {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
    this.diameter = 50;
    this.speed = 5;
    this.health = 100;
  }

  update() {
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= this.speed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.x += this.speed;
    }
    if (keyIsDown(UP_ARROW)) {
      this.y -= this.speed;
    }
    if (keyIsDown(DOWN_ARROW)) {
      this.y += this.speed;
    }
    if (keyIsDown(32)) {
      atirar();
      gameStarted = false;
    }

    this.x = constrain(this.x, 0 + this.diameter / 2, width - this.diameter / 2);
    this.y = constrain(this.y, 0 + this.diameter / 2, height - this.diameter / 2);
  }

  show() {
    image(naveImage, this.x - this.diameter / 2, this.y - this.diameter / 2, this.diameter, this.diameter);
    fireParticles.push({ x: this.x, y: this.y + 40 + random(-20, 20) }); 

  for (let i = 0; i < fireParticles.length; i++) {
    fill(0, 191, 255, 150); 
    noStroke();
    ellipse(fireParticles[i].x, fireParticles[i].y, 10, 5); 
    fireParticles[i].y += 10; 

    if (fireParticles[i].y > height) {
      fireParticles.splice(i, 1);
    }}
  }
}

function atirar() {
  if (frameCount - lastShotFrame >= shotCooldownFrames) {
    let bullet = {
      x: player.x,
      y: player.y - 15,
      diameter: 10,
      speed: 10
    };
    bullets.push(bullet);

    lastShotFrame = frameCount;
  }
}


function resetGame() {
  player = new Player();
  obstacles = []; 
  items = []; 
  score = 0; 
  gameOver = false; 
  gamePaused = false; 
  startTime = Date.now(); 
  currentTime = 0; 
  targetHealthWidth = 200; 
  currentHealthWidth = 200;
}

function showHealthBar() {
  fill(255, 0, 0); 
  noStroke();
  rect(width / 2 - 100, 10, 200, 20); 

  targetHealthWidth = map(player.health, 0, 100, 0, 200); 
  currentHealthWidth = lerp(currentHealthWidth, targetHealthWidth, 0.0800); 

  fill(0, 255, 0); 
  rect(width / 2 - 100, 10, currentHealthWidth, 20); 
}

function takeDamage(amount) {
  player.health -= amount;
  if (player.health <= 0) {
    player.health = 0;
    gameOver = true; 
  }
}

class Obstacle {
  constructor() {
    this.x = random(0, width);
    this.y = 0;
    this.size = random(20, 100);
    this.speed = random(2, 7);
    this.hasDamaged = false;
    this.image = random([objtImage, objt2Image]);
    this.rotation = 0; 
    this.rotationSpeed = random(-0.1, 0.1);  
  }

  update() {
    this.y += this.speed;
    this.rotation += this.rotationSpeed;
  }

  show() {
    push(); 
    translate(this.x, this.y); 
    rotate(this.rotation); 
    image(this.image, -this.size / 2, -this.size / 2, this.size, this.size); 
    pop();
  }


  collides(player) {
    let d = dist(this.x, this.y, player.x, player.y);
    if (d < (this.size / 2 + player.diameter / 2) && !this.hasDamaged) {
      takeDamage(10);
      this.hasDamaged = true;
      this.y > height;
      return true;
    }
    return false;
  }

  offScreen() {
    return this.y > height;
  }
}

class Item {
  constructor() {
    this.x = random(0, width);
    this.y = 0;
    this.size = 50;
    this.speed = 3;
    this.image = random([speedImage, slowImage, bigImage, smallImage, healthImage, commumImage, invertedImage]); // Imagem do item
    let itemTypes = ['speed', 'size', 'commum', 'bigger', 'smaller', 'health', 'inverted', 'bullet']; // Tipos de buffs
    this.type = random(itemTypes);
  }

  update() {
    this.y += this.speed;
  }

  show() {
    if (this.type === 'speed') {
      image(speedImage, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    } else if (this.type === 'slow') {
      image(slowImage, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    } else if (this.type === 'bigger') {
      image(bigImage, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    } else if (this.type === 'smaller') {
      image(smallImage, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    } else if (this.type === 'health') {
      image(healthImage, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    } else if (this.type === 'commum') {
      image(commumImage, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    }  else if (this.type === 'inverted') {
      image(invertedImage, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    } else if (this.type === 'bullet') {
      image(orbImage, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    }
  }

  collides(player) {
    let d = dist(this.x, this.y, player.x, player.y);
    return d < (this.size / 2 + player.diameter / 2);
  }

  offScreen() {
    return this.y > height;
  }

  applyEffect(player) {
    if (this.type === 'speed') {
      player.speed += 5;
      effectMessage = "Velocidade aumentada!";
      effectEndTime = frameCount + 180; 
      setTimeout(() => {
        player.speed -= 5; 
      }, 5000);
    } else if (this.type === 'slow') {
      player.speed -= 5;
      effectMessage = "Velocidade reduzida!";
      effectEndTime = frameCount + 180; 
      setTimeout(() => {
        player.speed += 5; 
      }, 5000); 
    } else if (this.type === 'bigger') {
      player.diameter += 10;
      effectMessage = "Tamanho aumentado!";
      effectEndTime = frameCount + 180; 
      setTimeout(() => {
        player.diameter -= 10; 
      }, 5000); 
    } else if (this.type === 'smaller') {
      player.diameter -= 10;
      effectMessage = "Tamanho reduzido!";
      effectEndTime = frameCount + 180; 
      setTimeout(() => {
        player.diameter += 10; 
      }, 5000); 
    } else if (this.type === 'bullet') {
      shotCooldownFrames -= 20; 
        effectMessage = "Buff de ataque!";
        effectEndTime = frameCount + 180; 
        setTimeout(() => {
          shotCooldownFrames += 20; 
        }, 5000);
    } else if (this.type === 'health') {
      if (player.health < 100) {
        player.health += 20; 
        effectMessage = "Saúde restaurada!";
      effectEndTime = frameCount + 180;
        if (player.health > 100) {
          player.health = 100; 
        }
      }
    } else if (this.type === 'inverted') {
      obstacles.forEach(obstacle => {
        obstacle.speed = -obstacle.speed;
        obstacle.y = 500; 
        effectMessage = "Proteja-se!";
      effectEndTime = frameCount + 180;
      });
    
      setTimeout(() => {
        obstacles.forEach(obstacle => {
          obstacle.speed = Math.abs(obstacle.speed);
        });
      }, 5000);
    }
    else if (this.type === 'commum') {
      pointsFromItems += 20;
      effectMessage = "Score aumentado!";
      effectEndTime = frameCount + 180; 
    }
  }
}
