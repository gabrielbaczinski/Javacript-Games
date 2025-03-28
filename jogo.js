let player;
let obstacles = [];
let items = [];
let score = 0;
let gravity = 0.1;
let playerSpeed = 3;
let gameOver = false;
let gamePaused = false;
let bgImage;
let cmtImagem;
let naveImage;
let objtImage;
let objt2Image;
let buffImage;
let targetHealthWidth = 200; // Largura inicial da barra de saúde
let currentHealthWidth = 200;
let bgY = 0;

function setup() {
  createCanvas(600, 500);
  player = new Player();
}

function preload() {
  bgImage = loadImage('space.jpeg');
  objtImage = loadImage('asteroid.png');
  buffImage = loadImage('meteoro.png');
  objt2Image = loadImage('meteoro2.png');
  cmtImagem = loadImage('cometa.png');
  cmt2Imagem = loadImage('cometa2.png');
  naveImage = loadImage('nave.png'); // Substitua pelo caminho correto da imagem
}

function draw() {
  background(0);

  // Movimento da imagem de fundo
  image(bgImage, 0, bgY, width, height);
  image(bgImage, 0, bgY - height, width, height);

  bgY += 2; // Velocidade do movimento

  if (bgY >= height) {
    bgY = 0;
  }

  // Se o jogo estiver pausado, apenas exibe a mensagem
  if (gamePaused) {
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("JOGO PAUSADO", width / 2, height / 2);
    return;
  }

  if (gameOver) {
    textSize(32);
    fill(255);
    textAlign(CENTER);
    text('Game Over!', width / 2, height / 2);
    return;
  }

  // Atualiza e exibe o jogador
  player.update();
  player.show();

  // Cria obstáculos e itens periodicamente
  if (frameCount % 60 === 0) {
    obstacles.push(new Obstacle());
    obstacles.push(new Obstacle());
    items.push(new Item());
  }

  // Atualiza e exibe obstáculos
  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].update();
    obstacles[i].show();

    if (obstacles[i].collides(player)) {
      takeDamage(10); // Dano ao jogador
      obstacles[i].hasDamaged = true; // Evita dano contínuo
    }

    if (obstacles[i].offScreen()) {
      obstacles.splice(i, 1);
    }
  }

  // Atualiza e exibe itens
  for (let i = items.length - 1; i >= 0; i--) {
    items[i].update();
    items[i].show();

    if (items[i].collides(player)) {
      items[i].applyEffect(player);
      score++;
      items.splice(i, 1);
    }

    if (items[i].offScreen()) {
      items.splice(i, 1);
    }
  }

  // Exibe a pontuação
  fill(255);
  textSize(24);
  text('Score: ' + score, 20, 30);

  // Exibe a barra de saúde
  showHealthBar();
}

// Função para alternar pausa quando ESC for pressionado
function keyPressed() {
  if (keyCode === ESCAPE) {
    gamePaused = !gamePaused;
  }
}

// Classe Player
class Player {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
    this.diameter = 40;
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

    this.x = constrain(this.x, 0 + this.diameter / 2, width - this.diameter / 2);
    this.y = constrain(this.y, 0 + this.diameter / 2, height - this.diameter / 2);
  }

  show() {
    image(naveImage, this.x - this.diameter / 2, this.y - this.diameter / 2, this.diameter, this.diameter);
  }
}

function showHealthBar() {
  fill(255, 0, 0); // Cor vermelha para a parte da barra de saúde
  noStroke();
  rect(width / 2 - 100, 10, 200, 20); // Barra de fundo da saúde

  // Suaviza a transição da largura da barra de saúde
  targetHealthWidth = map(player.health, 0, 100, 0, 200); // Calcula a largura alvo da barra de saúde
  currentHealthWidth = lerp(currentHealthWidth, targetHealthWidth, 0.0800); // Interpola suavemente entre as larguras

  fill(0, 255, 0); // Cor verde para a parte da saúde
  rect(width / 2 - 100, 10, currentHealthWidth, 20); // Barra de saúde animada
}


// Função para diminuir a saúde (quando o jogador colide com obstáculos)
function takeDamage(amount) {
  player.health -= amount;
  if (player.health <= 0) {
    player.health = 0;
    gameOver = true; // Define o game over quando a saúde chega a zero
  }
}

class Obstacle {
  constructor() {
    this.x = random(0, width);
    this.y = 0;
    this.size = random(20, 100);
    this.speed = random(2, 7);
    this.hasDamaged = false;
    this.image = random([objtImage, objt2Image]); // Flag para evitar dano contínuo
  }

  update() {
    this.y += this.speed;
  }

  show() {
    // Exibe a imagem escolhida para o obstáculo
    image(this.image, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
  }


  collides(player) {
    let d = dist(this.x, this.y, player.x, player.y);
    if (d < (this.size / 2 + player.diameter / 2) && !this.hasDamaged) {
      takeDamage(10);
      this.hasDamaged = true; // Evita dano contínuo
      return true;
    }
    return false;
  }

  offScreen() {
    return this.y > height;
  }
}


// Classe Item com buffs
class Item {
  constructor() {
    this.x = random(0, width);
    this.y = 0;
    this.size = 30;
    this.speed = 3;
    this.image = random([cmtImagem, buffImage, cmt2Imagem]); // Imagem do item
    let itemTypes = ['speed', 'size', 'commum', 'bigger', 'smaller', 'health']; // Tipos de buffs
    this.type = random(itemTypes);
  }

  update() {
    this.y += this.speed;
  }

  show() {
    if (this.type === 'speed') {
      image(buffImage, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    } else if (this.type === 'size') {
      image(cmtImagem, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    } else if (this.type === 'commum') {
      image(cmt2Imagem, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
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
      player.speed += 2; // Aumenta a velocidade do jogador
      setTimeout(() => {
        player.speed -= 2; // Volta ao normal após 5 segundos
      }, 5000);
    } else if (this.type === 'slow') {
      player.speed -= 2; // Aumenta a velocidade do jogador
      setTimeout(() => {
        player.speed += 2; // Volta ao normal após 5 segundos
      }, 5000); // Volta ao normal após 5 segundos
    } else if (this.type === 'bigger') {
      player.diameter += 5; // Aumenta a velocidade do jogador
      setTimeout(() => {
        player.diameter -= 5; // Volta ao normal após 5 segundos
      }, 5000); // Volta ao normal após 5 segundos
    } else if (this.type === 'smaller') {
      player.diameter -= 5; // Aumenta a velocidade do jogador
      setTimeout(() => {
        player.diameter += 5; // Volta ao normal após 5 segundos
      }, 5000); // Volta ao normal após 5 segundos
    } else if (this.type === 'health') {
      player.health += 20; // Aumenta a velocidade do jogador // Volta ao normal após 5 segundos
    }
    else if (this.type === 'commum') {
      // Efeito comum, nada acontece
    }
  }
}
