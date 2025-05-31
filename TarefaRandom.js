let particulas = [];
let modo = 1;

function setup() {
  createCanvas(600, 400);
  background(10);
}

function draw() {
  background(10, 25);

  if (modo === 2) {
    for (let i = 0; i < 5; i++) {
      particulas.push(new Particula(random(width), -10, modo));
    }
  } else if (modo === 3 && frameCount % 5 === 0) {
    particulas.push(new Particula(random(width), height + 10, modo));
  }

  for (let i = particulas.length - 1; i >= 0; i--) {
    let p = particulas[i];
    p.atualizar();
    p.mostrar();

    if (p.acabou()) {
      particulas.splice(i, 1);
    }
  }

  mostrarModo();
}

function mousePressed() {
  modo = int(random(1, 4));
  let quantidade = (modo === 1) ? int(random(50, 150)) : 30;

  for (let i = 0; i < quantidade; i++) {
    let px = mouseX;
    let py = mouseY;
    if (modo === 2) py = -10;
    else if (modo === 3) py = height + 10;
    particulas.push(new Particula(px, py, modo));
  }
}

function mostrarModo() {
  noStroke();
  fill(255);
  textSize(14);
  textAlign(LEFT, TOP);
  let nome = (modo === 1) ? 'Explosão' : (modo === 2) ? 'Chuva' : 'Fumaça';
}

class Particula {
  constructor(x, y, tipo) {
    this.tipo = tipo;
    this.pos = createVector(x, y);
    this.vida = 255;

    if (tipo === 1) {
      let ang = random(TWO_PI);
      let vel = random(2, 6);
      this.vel = p5.Vector.fromAngle(ang).mult(vel);
      this.cor = color(random(255), random(255), random(255));
      this.raio = random(3, 6);
      this.acel = createVector(0, 0.05);
    } else if (tipo === 2) {
      this.vel = createVector(random(-0.5, 0.5), random(4, 7));
      this.cor = color(100, 100, 255, 150);
      this.raio = random(2, 3);
    } else if (tipo === 3) {
      this.vel = createVector(random(-0.5, 0.5), random(-1, -2));
      this.cor = color(200, 200, 200, 100);
      this.raio = random(5, 10);
    }
  }

  atualizar() {
    this.pos.add(this.vel);
    if (this.tipo === 1) {
      this.vel.add(this.acel);
    }
    this.vida -= 2;
  }

  mostrar() {
    noStroke();
    fill(this.cor.levels[0], this.cor.levels[1], this.cor.levels[2], this.vida);
    ellipse(this.pos.x, this.pos.y, this.raio * 2);
  }

  acabou() {
    return this.vida <= 0 || this.pos.y > height + 20 || this.pos.y < -20;
  }
}
