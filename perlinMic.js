

// Control Parameters

var Rin  = 100;
var Rout = 250;
var inflation = 1.5;
var volShift =0.5;
var glitchLevel =0.15;
var glitchAmp = 200;

//

var guiParams = function() {

	this.senstivity = 50;
	this.spread =50;
  this.glitchThreshold =50;
  this.glitchAmplitude = 50;
};


var gui;
var guiP;


var w = []; // array of Walker objects
var N;

var hue ;
var strW, elpW;


var mic, fft, analyzer, prevVol, vol;
var glitch = false;
var glitchx;

var n = 256;
var minRad = 50;
var maxRad = 600;
var nfAng = 0.01;
var nfTime = 0.005;

var rad=400;

function setup() {
  var myCanvas = createCanvas(windowWidth/1.5, windowWidth/2.5);
  myCanvas.parent("myBanner");

  mic = new p5.AudioIn();
  mic.start();

  fft = new p5.FFT();
  fft.setInput(mic);

  analyzer = new p5.Amplitude();
  analyzer.setInput(mic);

  background(255);
  //strokeWeight(1.5);
}   

function draw() 
{
  if(frameCount%500 <20){
    noStroke();
    fill(255, frameCount%500* 255/20);
    rect(0, 0, width, height);
  }
  noFill();
  stroke(0,45);

  vol=10*analyzer.getLevel();
  var spectrum = fft.analyze();

  translate(width/2, height);
  rotate(radians(frameCount));

  beginShape();
  for (var i=0; i<n; i++) {
    maxRad=   map(vol*spectrum[i], 0, 255, rad, rad+500);
    var ang = map(i, 0, n, 0, 6.283);
    rad = map(noise(i*nfAng, frameCount*nfTime), 0, 1, minRad, maxRad);
    var x = rad * cos(ang);
    var y = rad * sin(ang);
    curveVertex(x, y);
  }
  endShape(CLOSE);
}
/*
function setup() {

  var myCanvas = createCanvas(windowWidth/1.5, windowWidth/2.5);
  myCanvas.parent("myBanner");

  //guiParams();
  guiP = new guiParams();
  gui = new dat.GUI();
  gui.add(guiP, 'senstivity', 0,100);
  gui.add(guiP, 'spread', 0, 100);
  gui.add(guiP, 'glitchThreshold', 0, 100);
  gui.add(guiP, 'glitchAmplitude', 0, 100);



  mic = new p5.AudioIn();
  mic.start();

  fft = new p5.FFT();
  fft.setInput(mic);

  analyzer = new p5.Amplitude();
  analyzer.setInput(mic);


  //frameRate(20);
  smooth();
  imageMode(CENTER);
  ellipseMode(RADIUS);

  // Create walkers
  N=20;
  n = N;
  for (var i=0; i<N; i++) {
    w.push(new Walker());
  }

  // color defintions
  //colorMode(HSB);
  background(255);
  hue = random(250);

  // for mobile
  if (width>500) {
    strW = 2.0; 
    elpW = 1.0;
    imgW = width/4;
  } else {
    strW = 0.8; 
    elpW = 1.4;
    imgW = width/2;
  }

  noStroke();
  fill(50);

}





function draw() {
  
  updateParams();

  vol =2* analyzer.getLevel();
  
  var spectrum = fft.analyze();

  noStroke();
  fill(255, 60);
  rect(0, 0, width, height);

  var level =0; 
  var magic =0;

  strokeWeight(strW);
  for (var i = 0; i < n; i++) {

    level =   map(spectrum[100+ 10*i], 0, 255, Rin, Rin + 500);
    
    magic = level*inflation*(vol+volShift)*(vol+volShift);

    w[i].walk(magic);
    w[i].transform();
    w[i].mouseReact();

    for (var j = 0; j <= i; j++) {

      if (i!=j) {  
       if (glitch) {
          stroke(255, 0, 0, 50);
          line(w[i].x + glitchx, w[i].y, w[j].x + glitchx, w[j].y);

          stroke(0, 0,255, 50);
          line(w[i].x - glitchx, w[i].y, w[j].x - glitchx, w[j].y);
        }
       
        stroke(0, 100);
        line(w[i].x, w[i].y, w[j].x, w[j].y);
       
      }
    }
  }


  glitchCheck();

  prevVol = vol;
}


function updateParams(){
   inflation = map(guiP.senstivity, 0,100, 0.5,2.5);
   volShift = map(guiP.spread, 0,100, 0,1);
   glitchLevel = map(guiP.glitchThreshold, 100,0, 0,0.4);
   glitchAmp = map(guiP.glitchAmplitude, 0,100, 1,500);
}

function glitchCheck(){
  if ( vol- prevVol > glitchLevel) {
    glitch =true;
  } else { 
  if(frameCount%20==0)
   { glitch =false;}
  }

  if (glitch){
    glitchx = glitchAmp*sin(vol);
  }
}

// Walker class
function Walker() {

  this.noffr = random(1000);
  this.nofft = random(1000);

  this.r = random(Rin, Rout);
  this.t = random(0, 360);
  if (random(1)>0.5) {
    this.t=(this.t+180)%360;
  }


  this.pr = this.r; 
  this.pt = this.t;

  this.x =0;
  this.y =0; 

  // Polar To Cartesian walker
  this.transform= function() {

    this.x = width/2 + (this.r*sin(radians(this.t)));
    this.y = height/2 + (this.r*cos(radians(this.t)));

    this.x=constrain(this.x, 0, width);
    this.y=constrain(this.y, 0, height);

    //ellipse(this.x, this.y, elpW, elpW);
  }

  // Walk
  this.walk =function(Rout) {

    this.pr = this.r;
    this.pt = this.t;

    this.r = map(noise(this.noffr), 0, 1, Rin, Rout);
    this.t = map(noise(this.nofft), 0, 1, -360, 360);

    this.noffr += map(vol, 0, 1, 0.001, 0.006);
    this.nofft += map(vol, 0, 1, 0.0006, 0.0024);
  }

  // mouse React
  this.mouseReact =function() {

    var deltax = map(mouseX, 0, width, width/50, -width/50);
    var deltay = map(mouseY, 0, height, height/50, -height/50);

    this.x = constrain(this.x+deltax, 0, width);
    this.y = constrain(this.y+deltay, 0, height);
  }
}

*/

function changeN() {

  if (frameCount % 30 == 0 ) {
    if ( down == true ) n--;
    else n++;
  }

  if (n < 3) {
    down = false;
    n++;
    hue = random(255);
  }

  if (n ==N) {
    down=true;
  }//hue = random(255);}
}

