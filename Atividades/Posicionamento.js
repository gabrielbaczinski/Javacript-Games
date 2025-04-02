let bolaPos;
let bolaVel;
let paredeNormal;

function setup() {
  createCanvas(600, 600);
  bolaPos = createVector(width / 2, height / 2);
  bolaVel = p5.Vector.random2D().mult(3);
  paredeNormal = createVector(0, -1);
}

function draw() {
  background(0);
  bolaPos.add(bolaVel);
  
  if (bolaPos.x < 0 || bolaPos.x > width) {
    bolaVel.x = -bolaVel.x;
  }
  
  if (bolaPos.y < 0 || bolaPos.y > height) {
    bolaVel.y = -bolaVel.y;
  }
  
  fill(255, 0, 0);
  noStroke();
  ellipse(bolaPos.x, bolaPos.y, 50, 50);

  if (bolaPos.y > height) {
    bolaVel = bolaVel.reflect(paredeNormal);
  }
}
