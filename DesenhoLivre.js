let cloudOneX = 50;
let cloudOneY = 0;
let cloudTwoX = 50;
let cloudTwoY = 0;
let cloudThreeX = 50;
let cloudThreeY = 0;
let cloudOneSpeed = 300;
let cloudTwoSpeed = 100;
let cloudThreeSpeed = -100;
let lineXone = 0;
let lineYone = 0;
let color1;
let color2;

function setup() {
createCanvas(600, 500);
   color1 = color("rgb(1,1,108)"); 
  color2 = color('rgb(220,7,7)');

}
function draw() {
  for (let i = 0; i <= height; i++) {
    let interColor = lerpColor(color1, color2, map(i, 0, height, 0, 1));
    stroke(interColor);
    line(0, i, width, i);
  }
  
  stroke(120)
  fill("rgb(212,222,225)")
circle(300, 250, 150);
  fill("rgb(212,222,225)")
  circle(335,230,15);
  circle(325,300,15);
  circle(365,270,15);
  circle(340,200,15);
  circle(320,190,1);
  circle(365,230,1);
  circle(340,280,1);
  fill("yellow")
  circle(260,250,150);
  
  fill(255);
  stroke(255)
  ellipse(cloudOneX, +50, 40, 40);
    ellipse(cloudOneX +30, 50, 40, 40);
      ellipse(cloudOneX +40, 70, 40, 40);
    ellipse(cloudOneX +60, 50, 40, 40);
  ellipse(cloudOneX, 70, 40, 40);
  
  ellipse(cloudTwoX - 10, 300, 40, 40);
  ellipse(cloudTwoX - 30, 320, 40, 40);
  ellipse(cloudTwoX +5, 325, 40, 40);
  ellipse(cloudTwoX +15, 290, 40, 40);
  ellipse(cloudTwoX +30, 320, 40, 40);
   ellipse(cloudTwoX +45, 300, 40, 40);
  
   ellipse(cloudThreeX - 10, 500, 40, 40);
  ellipse(cloudThreeX - 30, 520, 40, 40);
  ellipse(cloudThreeX +5, 525, 40, 40);
  ellipse(cloudThreeX +15, 490, 40, 40);
  ellipse(cloudThreeX +30, 520, 40, 40);
   ellipse(cloudThreeX +45, 500, 40, 40);
  cloudOneX = frameCount % width
  cloudTwoX = frameCount % width
  cloudThreeX = frameCount % width
    cloudOneX += cloudOneSpeed;
  cloudTwoX += cloudTwoSpeed;
  cloudThreeX += cloudThreeSpeed;
  
  if (random(1) < 0.1) {  
    stroke("yellow");
    line(lineXone, lineYone, lineXone + 70, lineYone - 70);
    lineXone = random(0, width);
    lineYone = random(0, height);
  }
  

}