
var w = []; // array of Jitter objects
<<<<<<< HEAD:intro.js
var n, N = 10;
var down = true;
=======
var n, N = 15;
var down = false;
>>>>>>> arabic:banner.js

var hue ;
var strW, elpW;



function setup() {
  
  var myCanvas = createCanvas(windowWidth/1.4,windowWidth/2.5);
  myCanvas.parent("myBanner");

  
  frameRate(20);
  smooth();
  imageMode(CENTER);

  // Create walkers
  for (var i=0; i<N; i++) {
    w.push(new Walker());
  }
  n = 3;
  
  // color defintions
  colorMode(HSB);
  background(255,40);
  hue = random(250);

  // for mobile
  if(width>500) {
    strW = 1.4; elpW = 2.0;
  }
  else {
    strW = 0.8; elpW = 1.4;
  }



}

function draw() {
  
  noStroke();
  fill(255,80);
  rect(0,0,width,height);
  var o = round(map(mouseX,0,width,1,8));
  var f = map(mouseY, 0, height, 0.01, 0.8);
  //noiseDetail(4,f);
  
  if (frameCount % 25 == 0 ) {
    if( down == true ) n--;
    else n++;
  }
 
  if (n < 1) {
      down = false;
      n++;
      hue = random(255);

   }

  if (n ==N) {down=true;}


  for (var i = 0; i < n; i++) {
    
    w[i].walk();
<<<<<<< HEAD:intro.js
    w[i].mouseRepel();
=======
    w[i].mouseReact();
>>>>>>> arabic:banner.js
    w[i].display();
    
    for (var j = 0; j <= i; j++) {

      if(i!=j){  
        strokeWeight(strW);
        stroke(hue,200,160,30);
        line(w[i].x,w[i].y,w[j].x,w[j].y);
      }
    }
  }
  if (frameCount % 10 == 0) hue=(hue+1)%255;
  
}

// Walker class
function Walker() {

  this.x = random(width);
  this.y = random(height);
  
  this.px = this.x;
  this.py = this.y;
 
  this.noffx = this.x;
  this.noffy = this.y;
  
  // Display walker
  this.display = function() {
    fill(hue,60,120);
    noStroke();
    ellipse(this.x, this.y, elpW, elpW);
    
  }

  // Walk
  this.walk =function() {
    
    this.px = this.x;
    this.py = this.y;
    
    this.x = map(noise(this.noffx),0,1,0,width);
    this.y = map(noise(this.noffy),0,1,0,height);
    
    this.noffx += 0.01;
    this.noffy += 0.01;
  }
<<<<<<< HEAD:intro.js
=======
  
  // Walk
  this.mouseReact =function() {
    
    var deltax = map(mouseX, 0,width,width/8,-width/8);
    var deltay = map(mouseY, 0,height,height/18,-height/18);

    this.x = constrain(this.x+deltax,0,width);
    this.y = constrain(this.y+deltay,0,height);

  
  }

}
/*
function initWalkers(){
  for (var i=0; i<N; i++) {
    bugs.push(new Walker());
  }
>>>>>>> arabic:banner.js
  
  // Repel
  this.mouseRepel =function() {
    
    var deltax = map(mouseX, 0,width,width/10,-width/10);
    var deltay = map(mouseY, 0,height,height/10,-height/10);

    this.x = constrain(this.x+deltax,0,width);
    this.y = constrain(this.y+deltay,0,height);
   }
}

