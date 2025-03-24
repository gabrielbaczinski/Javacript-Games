// 1.

let bolaTecladoX, bolaTecladoY;
let velocidadeX = 0, velocidadeY = 0;

function setup() {
  createCanvas(600, 500);
  bolaTecladoX = width / 2;
  bolaTecladoY = height / 2;
}

function draw() {
  background(200);
  bolaTecladoX += velocidadeX;
  bolaTecladoY += velocidadeY;
  fill("red");
  ellipse(bolaTecladoX, bolaTecladoY, 30, 30);
  fill("blue");
  ellipse(mouseX, mouseY, 30, 30);

  if (bolaTecladoX < 15) bolaTecladoX = 15;
  if (bolaTecladoX > width - 15) bolaTecladoX = width - 15;
  if (bolaTecladoY < 15) bolaTecladoY = 15;
  if (bolaTecladoY > height - 15) bolaTecladoY = height - 15;
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) velocidadeX = -2;
  if (keyCode === RIGHT_ARROW) velocidadeX = 2;
  if (keyCode === UP_ARROW) velocidadeY = -2;
  if (keyCode === DOWN_ARROW) velocidadeY = 2;
}

function keyReleased() {
  if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) velocidadeX = 0;
  if (keyCode === UP_ARROW || keyCode === DOWN_ARROW) velocidadeY = 0;
}

// 2.

let bolinhaX, bolinhaY;
let destinoX, destinoY;
let velocidade = 5;

function setup() {
  createCanvas(600, 500);
  bolinhaX = width / 2;
  bolinhaY = height / 2;
  destinoX = bolinhaX;
  destinoY = bolinhaY;
}

function draw() {
  background(220);
  
  fill("red");
  ellipse(bolinhaX, bolinhaY, 30, 30);
  
  if (bolinhaX < destinoX) bolinhaX += velocidade;
  if (bolinhaX > destinoX) bolinhaX -= velocidade;
  
  if (bolinhaY < destinoY) bolinhaY += velocidade;
  if (bolinhaY > destinoY) bolinhaY -= velocidade;
}

function mousePressed() {
  destinoX = mouseX;
  destinoY = mouseY;
}

// 3.

function setup() {
    createCanvas(400, 400);
  }
  
  function draw() {
    background(220);
  
    let h = hour();
    let m = minute();
    let s = second();
  
    stroke(0);
    strokeWeight(4);
    noFill();
    ellipse(200, 200, 300, 300);
  
    let anguloHora = map(h % 12, 0, 12, 0, TWO_PI) - HALF_PI;
    line(200, 200, 200 + cos(anguloHora) * 50, 200 + sin(anguloHora) * 50);
  
    let anguloMinuto = map(m, 0, 60, 0, TWO_PI) - HALF_PI;
    line(200, 200, 200 + cos(anguloMinuto) * 70, 200 + sin(anguloMinuto) * 70);
  
    let anguloSegundo = map(s, 0, 60, 0, TWO_PI) - HALF_PI;
    stroke(255, 0, 0);
    line(200, 200, 200 + cos(anguloSegundo) * 90, 200 + sin(anguloSegundo) * 90);
  }
  