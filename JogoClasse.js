let jogador;
let inimigos = [];
let gameOver = false;
let fade = 0;

function setup() {
  createCanvas(600, 400);
  jogador = new Jogador(width / 2, height / 2);

  for (let i = 0; i < 3; i++) {
    let x = random(width);
    let y = random(height);
    let dx = random([-2, 2]);
    let dy = random([-2, 2]);
    inimigos.push(new Inimigo(x, y, dx, dy));
  }
}

function draw() {
  if (!gameOver) {
    background(220, 200);
    jogador.mover();
    jogador.mostrar();
    jogador.verificarColisao(inimigos);

    for (let inimigo of inimigos) {
      inimigo.mover();
      inimigo.mostrar();
    }
  } else {
    background(255, 0, 0, 80);
    fade = min(fade + 3, 255);
    textAlign(CENTER, CENTER);
    textSize(40);
    fill(0, 0, 0, fade);
    text("Game Over", width / 2, height / 2);
  }
}

class Jogador {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vel = 3.5;
    this.raio = 20;
  }

  mover() {
    if (keyIsDown(87)) this.y -= this.vel;
    if (keyIsDown(83)) this.y += this.vel;
    if (keyIsDown(65)) this.x -= this.vel;
    if (keyIsDown(68)) this.x += this.vel;

    this.x = constrain(this.x, this.raio, width - this.raio);
    this.y = constrain(this.y, this.raio, height - this.raio);
  }

  mostrar() {
    fill(0, 255, 0);
    noStroke();
    ellipse(this.x, this.y, this.raio * 2);
  }

  verificarColisao(inimigos) {
    for (let inimigo of inimigos) {
      let d = dist(this.x, this.y, inimigo.x, inimigo.y);
      if (d < this.raio + inimigo.raio) {
        gameOver = true;
      }
    }
  }
}

class Inimigo {
  constructor(x, y, dx, dy) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.raio = 15;
    this.aceleracao = 0.002;
  }

  mover() {
    this.x += this.dx;
    this.y += this.dy;

    if (this.x < this.raio || this.x > width - this.raio) {
      this.dx *= -1;
    }
    if (this.y < this.raio || this.y > height - this.raio) {
      this.dy *= -1;
    }

    this.dx *= 1 + this.aceleracao;
    this.dy *= 1 + this.aceleracao;

    this.dx = constrain(this.dx, -5, 5);
    this.dy = constrain(this.dy, -5, 5);
  }

  mostrar() {
    fill(255, 0, 0);
    noStroke();
    ellipse(this.x, this.y, this.raio * 2);
  }
}
