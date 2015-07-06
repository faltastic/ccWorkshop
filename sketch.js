

/*
 To create a server
 $ cd WebDev/p5js/myProjects
 $ python -m SimpleHTTPServer
*/


var canvasSize;
var img, song;


function preload(){
 // img = loadImage("image.jpg");
 // song = loadSound('song.mp3');
}

function setup() {
  /*
  // For a sqaure canvas
  
  if ( windowWidth > windowHeight) {canvasSize = windowHeight;}
  else  {canvasSize = windowWidth;}
  
  var myCanvas = createCanvas(canvasSize, canvasSize);
  */
 
  var myCanvas = createCanvas(windowWidth/1.8,windowHeight/1.8);
  myCanvas.parent("myCanvas");
  smooth();
  noFill();
  noStroke();
  background(120,0,0);
  
}


function draw() {

 if (focused) test();
    
}


function test(){
   
  stroke(155);
  if (mouseIsPressed) {fill(55);} 
  else { fill(255);}
  
  ellipse(mouseX, mouseY, width/10, width/10);
}

function touchMoved() {
  ellipse(touchX, touchY, width/10, width/10);
  return false;
}

