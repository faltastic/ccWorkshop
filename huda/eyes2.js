

// to calculate angle between mouseX, Y and eyeX, Y

function getAngle(mx, my) {

  angle = atan2(my - ey, mx - ex);
}

/*

 Syntax
 atan2(y,x)
 
 
 var a = atan2(mouseY-height/2, mouseX-width/2);
 
 // then 
 rotate(a);
 
 
 Description
 Calculates the angle (in radians) from a specified point to the coordinate origin as
 measured from the positive x-axis. Values are returned as a float in the range from PI to -PI.
 
 The atan2() function is most often used for orienting geometry to the position of the cursor. 
 
 Note: The y-coordinate of the point is the first parameter, and the x-coordinate is the second parameter, 
 due the the structure of calculating the tangent.
 
 */



var c = []; // array of Walker objects
var R = 1;
var N = 100;

var w1 = 55;
var pctBlack = 0.33;

var transTime = 100;


var eyes =[];
var kaz ;
var blackeye;

var fade, x, y, eye, preveye, d;


function preload() {

  kaz = loadImage("img/kazoza.png");

  for (var i=1; i<9; i++) {
    var eye = loadImage("img/eyes/eye"+i+".png");
    eyes[i-1] = eye;
  }
} // end preload


// GUI
/////////////////

var gui;
var guiP;


// Control Parameters
var youPlay = true;
var mouseReact = true;


var guiParams = function() {

  this.Play = false;
  //this.Interactive = true;
};

function updateParams() {

  youPlay = guiP.Auto;
  mouseReact = guiP.Interactive;
}

/////////////////////////


function setup() {

  var myCanvas = createCanvas(windowWidth, windowHeight);
  myCanvas.parent("myBanner");

  //guiP = new guiParams();
  //gui = new dat.GUI();
  // gui.add(guiP, 'Play');
  // gui.add(guiP, 'Interactive');

  //// Resize

  var h1 = kaz.height*w1/kaz.width;

  kaz.resize(w1, h1);
  
  for (var i=0; i<eyes.length; i++) {
    eyes[i].resize(w1, h1);
  }

  // create Coins
  makeCoins();

  //background(197, 51, 54, 6);
  imageMode(CENTER);
  frameRate(20);

}// end setup


function mouseReleased() {

  if (mouseX > 0.40*width && mouseX < 0.60*width && mouseY > 0.70*height && mouseY < 0.80*height) {

    window.navigate ("www.google.com");
  }
}



function draw() {

  background(197, 51, 54);  // #c53336

 if ( mouseY > 0.6*height && mouseY < 0.9*height) {
    stroke(255);
    //noFill();
    fill(197, 51, 54);
    rect(0.45*width, 0.7*height, 0.1*width, 0.05*height, 5);
    text("Enter", 0.475 *width, 0.725*height);
  }



  fade = 125+125*sin( (frameCount%transTime)*TWO_PI/transTime); 

  //fade = 175 + 75*sin(fade);
  //map(frameCount%transTime, 0, transTime, 20,250);
  //console.log(fade);


  for (var i=0; i<N; i++) {

    x = c[i].x;
    y = c[i].y;  
    
    noTint();
    image( kaz, x, y);
    
    eye = c[i].eye;
    preveye=  c[i].preveye; // too resource demanding 

    //var a = atan2(mouseY-y+height/2, mouseX-x+width/2);

    if ( eye > -1) {

      //if(youPlay){

      d = dist(mouseX, mouseY, x, y);

      eye = floor(map(d, 0, height/2, 0, eyes.length-1));
      c[i].eye = eye; 
      //}

      //  else 
      if ( fade<24  && d < height/2) {
        eye = abs( floor(random(-eyes.length+1, eyes.length-1)) );
      }

    }

    c[i].eye = eye; 


    // push();
    // translate(width/2,height/2);
    // rotate(a);
    //blendMode(BLEND);  


    if ( eye >=0 ) {

      if (i==0) {
        tint(0, fade);
        //image( blackeye, x, y);
      }

      tint(255, 255-fade);
      image( eyes[preveye], x, y);

      tint(255, fade); 
      image( eyes[eye], x, y);
    } 
    else {
      //image( blackeye, x, y);
    }



    //pop();
  }

  // }  
  // updateParams();
  noTint();
  blendMode(REPLACE);

  if ( mouseY > 0.6*height && mouseY < 0.9*height) {
    stroke(255);
    //noFill();
    fill(197, 51, 54);
    rect(0.45*width, 0.7*height, 0.1*width, 0.1*height, 5);
    text("Enter", 0.45 *width, 0.75*height);
  }
  //text( (mouseX/width) + "   " + (mouseY/height), 100, 200);

} // end draw 



/////  Class Coin    //////////////////////////////////////

function Coin(R, theta) {

  this.eye = abs( floor(random(-eyes.length+1, eyes.length-1)) );

  if ( R>5 && random(1) < pctBlack ) {
    this.eye = -1;  // blackeye
  } 


  this.preveye = this.eye;

  //console.log(this.eye);

  this.r = R+random(-5, 5); //this.eyeN*40; 
  this.t = theta; 

  // Polar To Cartesian 
  //this.transform= function() {

  this.x = width/2 + (this.r*sin(radians(this.t)));
  this.y = height/2 + (this.r*cos(radians(this.t)));

  this.x=constrain(this.x, 0, width);
  this.y=constrain(this.y, 0, height);

  //}
}

////////////////////////

function makeCoins() {

  R = 1;
  theta = 0;
  var n = 0;

  for (var i=0; i<N; i++) {

    c.push( new Coin(R, theta) );

    if (i==0) {
      dTheta = ((w1)/R)*(180/PI);
    }
    theta += dTheta;
    n--;

    if (n<1) {

      R += (w1*1.15);
      theta = random(-5, 5);
      n = floor(TWO_PI*R /w1);
      dTheta = 360/n;
      // dTheta = (w1/R)*(180/PI);
    }
  }
}


/*
//every 
 
 if (!Array.prototype.every) {
 Array.prototype.every = function(callbackfn, thisArg) {
 'use strict';
 var T, k;
 
 if (this == null) {
 throw new TypeError('this is null or not defined');
 }
 
 // 1. Let O be the result of calling ToObject passing the this 
 //    value as the argument.
 var O = Object(this);
 
 // 2. Let lenValue be the result of calling the Get internal method
 //    of O with the argument "length".
 // 3. Let len be ToUint32(lenValue).
 var len = O.length >>> 0;
 
 // 4. If IsCallable(callbackfn) is false, throw a TypeError exception.
 if (typeof callbackfn !== 'function') {
 throw new TypeError();
 }
 
 // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
 if (arguments.length > 1) {
 T = thisArg;
 }
 
 // 6. Let k be 0.
 k = 0;
 
 // 7. Repeat, while k < len
 while (k < len) {
 
 var kValue;
 
 // a. Let Pk be ToString(k).
 //   This is implicit for LHS operands of the in operator
 // b. Let kPresent be the result of calling the HasProperty internal 
 //    method of O with argument Pk.
 //   This step can be combined with c
 // c. If kPresent is true, then
 if (k in O) {
 
 // i. Let kValue be the result of calling the Get internal method
 //    of O with argument Pk.
 kValue = O[k];
 
 // ii. Let testResult be the result of calling the Call internal method
 //     of callbackfn with T as the this value and argument list 
 //     containing kValue, k, and O.
 var testResult = callbackfn.call(T, kValue, k, O);
 
 // iii. If ToBoolean(testResult) is false, return false.
 if (!testResult) {
 return false;
 }
 }
 k++;
 }
 return true;
 };
 }
 */