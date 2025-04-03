let x = 150;
let y = 150;
let speed = 1;
let diameter = 50;
let anguloTorreta = 0;
let anguloMovimento = 0;

function setup() {
  createCanvas(400, 500);
}

function draw() {
  background(250);
  tanque();
}

function torreta() {
  push();
  translate(x, y);
  rotate(anguloTorreta);
  fill('white');
  ellipse(0, 0, 50, 50);
  rect(15, -5, 30, 10); 

  if (keyIsDown(65)) {
    anguloTorreta -= speed * 0.05;
  }
  if (keyIsDown(68)) {
    anguloTorreta += speed * 0.05;
  }
  pop();
}

function tanque() {
  push();
  translate(x, y);
  rotate(anguloMovimento);
  fill('black');
  rect(-diameter / 2, -diameter / 2, diameter, diameter);

  if (keyIsDown(LEFT_ARROW)) {
    anguloMovimento -= speed * 0.05;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    anguloMovimento += speed * 0.05;
  }
  if (keyIsDown(UP_ARROW)) {
    x += cos(anguloMovimento) * speed;
    y += sin(anguloMovimento) * speed;
  }
  if (keyIsDown(DOWN_ARROW)) {
    x -= cos(anguloMovimento) * speed;
    y -= sin(anguloMovimento) * speed;
  }

  x = constrain(x, diameter / 2, width - diameter / 2);
  y = constrain(y, diameter / 2, height - diameter / 2);

  pop();
  torreta();
}
