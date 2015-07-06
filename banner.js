
var w = []; // array of Jitter objects
var n, N = 20;
var down = true;

var hue ;
var strW, elpW;
var img, imgW, imgH;


function preload(){
  img = loadImage("assests/img/cc.png");
}

function setup() {
  
  var myCanvas = createCanvas(windowWidth/1.5,windowWidth/2.5);
  myCanvas.parent("myBanner");
  //createCanvas(710, 400);
  
  frameRate(20);
  smooth();
  imageMode(CENTER);

  // Create walkers
  for (var i=0; i<N; i++) {
    w.push(new Walker());
  }
  n = 0;
  
  // color defintions
  colorMode(HSB);
  background(255,40);
  hue = random(250);

  // for mobile
  if(width>500) {
    strW = 1.6; elpW = 2.0;
    imgW = width/4;
    imgH = img.height*imgW/img.width;
  }
  else {
    strW = 0.8; elpW = 1.4;
    imgW = width/2;
    imgH = img.height*imgW/img.width;
  }



}

function draw() {
  
  noStroke();
  fill(255,50);
  rect(0,0,width,height);
  var o = round(map(mouseX,0,width,1,8));
  var f = map(mouseY, 0, height, 0.01, 0.8);
  //noiseDetail(4,f);
  
  if (frameCount % 30 == 0 ) {
    if( down == true ) n--;
    else n++;
  }
 
  if (n < 1) {
      down = false;
      n++;
      hue = random(255);

   }

  if (n ==N) {down=true;}//hue = random(255);}


  for (var i = 0; i < n; i++) {
    
    w[i].walk();
    w[i].display();
    
    for (var j = 0; j <= i; j++) {

      if(i!=j){  
        strokeWeight(strW);
        stroke(hue,200,160,30);
        line(w[i].x,w[i].y,w[j].x,w[j].y);
      }
    }
  }
  if (frameCount % 20 == 0) hue=(hue+1)%255;

  image(img,width/2,height/2,imgW, imgH);

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
}
/*
function initWalkers(){
  for (var i=0; i<N; i++) {
    bugs.push(new Walker());
  }
  
}
*/