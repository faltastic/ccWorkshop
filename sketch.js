

/*
 To create a server
 $ cd WebDev/p5js/myProjects
 $ python -m SimpleHTTPServer
*/


var canvasSize;
var img, song;
var img1;

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
 
  var myCanvas = createCanvas(windowWidth/18,windowHeight/18);
  myCanvas.parent("myBanner");
  smooth();
  noFill();
  noStroke();
  background(120,0,0);
  img1 = selectAll('#img1');
}


function draw() {

 //if (focused) test();
 if (img1.mouseOver()){
  glitchItBaby("img1");  
 }
}
function glitchItBaby(imgid){
  var c1 = document.getElementById( imgid );
  var ctx_1 = c1.getContext( '2d' );

  var image_data_1 = ctx_1.getImageData( 0, 0, canvas_width, canvas_height );

    // glitch the image data (passing drawImageDataInCanvasTwo as a callback function)
  var parameters = { amount: 10, seed: 45, iterations: 30, quality: 30 };
    
    glitch( image_data_1, parameters, drawImageDataInCanvasTwo );
   
}
 
function drawImageDataInCanvasTwo( image_data )
{
  // put the glitched image data on canvas two.
  // https://developer.mozilla.org/en/docs/Web/API/CanvasRenderingContext2D#putImageData()
  ctx_1.putImageData( image_data, 0, 0 );
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

