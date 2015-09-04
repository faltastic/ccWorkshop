
var w = []; // array of Walker objects
var n, N;

var hue ;
var strW, elpW;

var Rin  = 100;
var Rout = 250;

var song, fft, vol, analyzer;
var readytoPlay = false;
var songloaded = false;

function preload(){
// song = loadSound('TD.mp3');
}

function setup() {
  
  var myCanvas = createCanvas(windowWidth/1.5,windowWidth/2.5);
  myCanvas.parent("myBanner");
  
  frameRate(20);
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
  colorMode(HSB);
  background(255);
  hue = random(250);

  // for mobile
  if(width>500) {
    strW = 2.0; elpW = 1.0;
    imgW = width/4;
  }
  else {
    strW = 0.8; elpW = 1.4;
    imgW = width/2;
  }
  
  noStroke();
  fill(50);
  textSize(30);
  textAlign(CENTER);
  text("Loading ...", width/2,height/2);
 
}


function draw() {

   if(!songloaded){
    song = loadSound('TD.mp3');
    songloaded = true;
    
   }
   
   if(frameCount>10 && song.isLoaded() && !song.isPlaying()){
       analyzeSound();
       
   }

   if( song.isPlaying()){
     visualizeSound();
   }
   
}

function analyzeSound(){
  
  fft = new p5.FFT();
  fft.setInput(song);
  
  analyzer = new p5.Amplitude();
  analyzer.setInput(song);
  
  background(255);
  text("Click to Play ", width/2,height/2);
   
  readytoPlay = true;
}

function mouseReleased() {
   
   if(readytoPlay){ song.play();}

}
   
function visualizeSound(){

   vol = analyzer.getLevel();
   var spectrum = fft.analyze();
   
  noStroke();
  fill(255,80);
  rect(0,0,width,height);
 
  //changeN();

  for (var i = 0; i < n; i++) {
    
    var level =  map(spectrum[ceil(spectrum.length/50) - i], 0, 255, 0, 350);

    w[i].walk(level);
    w[i].transform();
    //w[i].mouseReact();
    
    for (var j = 0; j <= i; j++) {

      if(i!=j){  
        strokeWeight(strW);
        stroke(0,80);
        line(w[i].x,w[i].y,w[j].x,w[j].y);
      }
    }
     
  }

}


// Walker class
function Walker() {

  this.noffr = random(1000);
  this.nofft = random(1000);
 
  this.r = random(Rin,Rout);
  this.t = random(0,360);
  if(random(1)>0.5){this.t=(this.t+180)%360;}
  

  this.pr = this.r; 
  this.pt = this.t;

  this.x =0;
  this.y =0; 

  // Polar To Cartesian walker
  this.transform= function() {
    
    this.x = width/2 + (this.r*sin(radians(this.t)));
    this.y = height/2 + (this.r*cos(radians(this.t)));
    
    this.x=constrain(this.x,0,width);
    this.y=constrain(this.y,0,height);

    //ellipse(this.x, this.y, elpW, elpW);
    
  }

  // Walk
  this.walk =function(Rout) {
    
    this.pr = this.r;
    this.pt = this.t;
    
    this.r = map(noise(this.noffr),0,1,Rin,Rout);
    this.t = map(noise(this.nofft),0,1,-360,360);
    
    this.noffr += 0.001;
    this.nofft += map(vol,0,1,0.001,0.006);
  }
  
  // mouse React
  this.mouseReact =function() {
    
    var deltax = map(mouseX, 0,width,width/20,-width/20);
    var deltay = map(mouseY, 0,height,height/20,-height/20);

    this.x = constrain(this.x+deltax,0,width);
    this.y = constrain(this.y+deltay,0,height);
   
  
  }

}



function changeN(){

  if (frameCount % 30 == 0 ) {
    if( down == true ) n--;
    else n++;
  }
 
  if (n < 3) {
      down = false;
      n++;
      hue = random(255);

   }

  if (n ==N) {down=true;}//hue = random(255);}
  
  
}
