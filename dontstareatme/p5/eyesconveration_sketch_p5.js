
var videoLooking;
var videoNotLooking;

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

// var videocamDom = "document.getElementById('videocam')";

//-----------------------------------------------------------------------
function setup(){    

  createCanvas(800,800);
  // background(255);
  // videoLooking = createVideo('data/MVI_1246.mp4');
  videoLooking = createVideo('data/videoLooking.mp4');
  videoNotLooking = createVideo('data/videoNotLooking.mp4');
  // videoNotLooking = createVideo('data/MVI_1246_1.mp4');


  

  videoLooking.loop();
  videoLooking.hide();
  videoNotLooking.loop();
  videoNotLooking.hide();

  //createCanvas(500, 500);
  // background(255);

  eyecamgaze();
  // document.getElementById("cam").style.visibility = "hidden
}
//-----------------------------------------------------------------------

function draw(){

  background(0);

  if(isVideoLooking){
    image(videoLooking,200,300);  
  }else{
    image(videoNotLooking,200,300);  
  }

  //------------------------------------------
  //Text to be deleted
/*  videoSliderTime = videoLooking.time();
  fill(0);
  textSize(10);
  text("counter:"+counter,100,100);
  text("eyes:"+eyesNumber,100,110);
  text("videoSlider:"+videoSliderTime,100,120);*/
  //-------------------------------------------

  if(counter>waitTillStopLooking && isVideoLooking){
    isVideoLooking=false;
   }
  if(counter<=10 && !isVideoLooking){
    isVideoLooking=true;
   }
  if(eyesNumber==0 && counter>waitTillStartLooking){
    counter--;
  }

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
