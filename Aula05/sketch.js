// Alunos: Gabriel Baczinski, Afonso Muller e João Guilherme Camargo

let obstacles = [];
let score = 0;
let gameOver = false;
let gamePaused = false;
let gameStarted = true;
let targetHealthWidth = 200;
let currentHealthWidth = 200;
let enemyBullets = [];
let enemyShotCooldownFrames = 30; // intervalo entre tiros dos inimigos
let bgY = 0;
let bgImage, logoImage, naveImage, explosionImage;
let objtImage, objt2Image;
let startTime;
let gameMusic;
let currentTime;
let scale = 1.0;
let growing = true;
let fireParticles = [];
let bullets = [];
let explosions = [];
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
  bgImage = loadImage('assets/image/space.png');
  logoImage = loadImage('assets/image/menu/menu.png');
  naveImage = loadImage('assets/image/destroyer.png');
  objtImage = loadImage('assets/image/intruder.png');
  objt2Image = loadImage('assets/image/intruder2.png');
  fogoImage = loadImage('assets/image/destroyerShot.png');
  gameMusic = loadSound('assets/music/menu.ogg');
  explosionImage = loadImage('assets/image/explosion.png');
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



  for (let i = explosions.length - 1; i >= 0; i--) {
    let exp = explosions[i];
    image(explosionImage, exp.x - 25, exp.y - 25, 50, 50); // ajuste o tamanho conforme a imagem
    exp.timer--;

    if (exp.timer <= 0) {
      explosions.splice(i, 1);
    }
  }

  
  // Atualiza balas inimigas
  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    let bullet = enemyBullets[i];
    bullet.y += bullet.speed;

    fill(255, 0, 0);
    noStroke();
    ellipse(bullet.x, bullet.y, bullet.diameter);

    // Verifica colisão com jogador
    let d = dist(bullet.x, bullet.y, player.x, player.y);
    if (d < (bullet.diameter / 2 + player.diameter / 2)) {
      takeDamage(10);
      enemyBullets.splice(i, 1);
      continue;
    }

    // Remove se sair da tela
    if (bullet.y > height) {
      enemyBullets.splice(i, 1);
    }
  }


  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].y -= bullets[i].speed;
    image(fogoImage, bullets[i].x - 14, bullets[i].y - 5, 10, 10);

    if (bullets[i].y < 0) {
      bullets.splice(i, 1);
      continue;
    }

    for (let j = obstacles.length - 1; j >= 0; j--) {
      let distance = dist(bullets[i].x, bullets[i].y, obstacles[j].x, obstacles[j].y);
      let collisionDistance = (bullets[i].diameter / 2) + (obstacles[j].size / 2);
    
      if (distance < collisionDistance) {
        createExplosion(obstacles[j].x, obstacles[j].y); // <-- Adicionada aqui
        obstacles.splice(j, 1);
        bullets.splice(i, 1);
        pointsFromItems += 5;
        break;
      }
    }
    
  }

  score = timeScore + pointsFromItems;

  fill(255);
  textSize(10);
  text('Score: ' + score, 380, 15);

  showHealthBar();
}

function createExplosion(x, y) {
  explosions.push({ x: x, y: y, timer: 20 });
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
      gameStarted = false;
    }
    // Disparo com clique do mouse
    if (mouseIsPressed) {
      atirar();
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
      }
    }
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
    this.lastShotFrame = frameCount + Math.floor(random(0, 60)); // cada um atira em tempos diferentes
  }

  update() {
    this.y += this.speed;
    this.rotation += this.rotationSpeed;
  
    // Atira se chegou o momento
    if (frameCount - this.lastShotFrame >= enemyShotCooldownFrames) {
      enemyBullets.push({
        x: this.x,
        y: this.y + this.size / 2,
        diameter: 10,
        speed: 5
      });
      this.lastShotFrame = frameCount;
    }
  
    // Remove se sair da tela
    if (this.y > height + this.size) {
      this.offScreen();
    }
  }
  

  shoot() {
    let bullet = {
      x: this.x,
      y: this.y + this.size / 2,
      diameter: 8,
      speed: 5
    };
    enemyBullets.push(bullet);
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
      return true;
    }
    return false;
  }

  offScreen() {
    return this.y > height;
  }
}

