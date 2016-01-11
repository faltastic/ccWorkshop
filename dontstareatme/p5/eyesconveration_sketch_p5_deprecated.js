
var video;

//time in video when deciding to stop looking
var timeToStopLooking=179;

//check if person in video is looking now
var isVideoLooking = true;
var eyesNumber=0;

//Smoothing the decision of looking or not
var counter=0;
var waitTillStopLooking = 10;
var waitTillStartLooking = 5;


var videoSliderTime=0;
var videoSliderTimeToStopLooking=178;
var videoSliderTimeEndOfVideo=240;

var videocamDom = "document.getElementById('videocam')";

//-----------------------------------------------------------------------
function setup(){    

  createCanvas(800,600);
  video = createVideo('data/zz1.mp4');


  video.loop();
  video.hide();

  createCanvas(500, 500);
  background(255);

  eyecamgaze();

  // document.getElementById("cam").style.visibility = "hidden

  // hide(videocamDom);
}
//-----------------------------------------------------------------------

function draw(){

  background(255);
  image(video,100,300);
  // videoSliderTime++;
  videoSliderTime = video.time();


  fill(0);
  textSize(10);
  text("counter:"+counter,100,100);
  text("eyes:"+eyesNumber,100,110);
  text("videoSlider:"+videoSliderTime,100,120);


  if(counter>waitTillStopLooking && isVideoLooking){
    stopLooking();
   }
  if(counter<=10 && !isVideoLooking){
    startLooking();
   }
  if(eyesNumber==0 && counter>waitTillStartLooking){
    counter--;
  }

  // if video reached the end of looking time
  if(videoSliderTime>=videoSliderTimeToStopLooking && isVideoLooking) {
    startLooking();
  }

  // if video reached the end of non looking
  if(videoSliderTime>=videoSliderTimeEndOfVideo && !isVideoLooking) {
    stopLooking();
  }

}

//-----------------------------------------------------------------------

function stopLooking() {
  video.time(timeToStopLooking);
  isVideoLooking=false;
  videoSliderTime=videoSliderTimeToStopLooking;
}
//-----------------------------------------------------------------------
function startLooking() {
    video.time(0); //can be 0
    isVideoLooking=true;
    videoSliderTime=0;
}
//-----------------------------------------------------------------------

function eyecamgaze () {
  var width = 193; //580
  var height = 146; //440
  var cGaze = new camgaze.Camgaze(width, height, "mainCanvas");

  
          /*for face: camgaze.cascades.frontalface*/
          /*for eye: camgaze.cascades.eye*/
  var eyeDetector = new camgaze.CVUtil.HaarDetector(
    camgaze.cascades.eye,
    width,height);
  var drawer = new camgaze.drawing.ImageDrawer();

  var frameOp = function (image_data, video) {
    eyeRects = eyeDetector.detectObjects(video,1.1,1);

    eyeRects.forEach(
      function (eye) {
        image_data = drawer.drawRectangle(image_data,eye,eye.width,eye.height,3,"red");
        
        if(counter<waitTillStopLooking+5) { counter++;}
      }
    
    );

      eyesNumber=eyeRects.length;

    return image_data;
  };
  cGaze.setFrameOperator(frameOp);
} 

//-----------------------------------------------------------------------

function hideshow(which){
  if (!document.getElementById)
  return
  if (which.style.display=="block")
  which.style.display="none"
  else
  which.style.display="block"
}

function hide(which){
  if (!document.getElementById)
  return
  which.style.display="none"
}
function show(which){
  if (!document.getElementById)
  return
  which.style.display="block"
}


