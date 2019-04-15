const canvas = $("canvas");
const clearBtn = $("#clear");
const subBtn = $('#submit');
const canvasContext = canvas[0].getContext("2d");
subBtn.css("display","none");

function init_Sign_Canvas() {
  isSign = false;
  leftMButtonDown = false;

   // Bind Mouse events
   canvas.on('mousedown', function (e) {
     if(e.which === 1) {
       leftMButtonDown = true;
       canvasContext.fillStyle = "#000";
       var x = e.pageX - $(e.target).offset().left;
       var y = e.pageY - $(e.target).offset().top;
       canvasContext.moveTo(x, y);
     }
     e.preventDefault();
     return false;
   });

   canvas.on('mouseup', function (e) {
     if(leftMButtonDown && e.which === 1) {
       leftMButtonDown = false;
       isSign = true;
     }
     e.preventDefault();
     return false;
   });

   // draw a line from the last point to this one
   canvas.on('mousemove', function (e) {
     if(leftMButtonDown == true) {
       subBtn.css("display","block");
       canvasContext.fillStyle = "#000";
       var x = e.pageX - $(e.target).offset().left;
       var y = e.pageY - $(e.target).offset().top;
       canvasContext.lineTo(x,y);
       canvasContext.stroke();
     }
     e.preventDefault();
     return false;
   });

   //bind touch events
   canvas.on('touchstart', function (e) {
    leftMButtonDown = true;
    canvasContext.fillStyle = "#000";
    var t = e.originalEvent.touches[0];
    var x = t.pageX - $(e.target).offset().left;
    var y = t.pageY - $(e.target).offset().top;
    canvasContext.moveTo(x, y);

    e.preventDefault();
    return false;
   });

    canvas.on('touchmove', function (e) {
    canvasContext.fillStyle = "#000";
    subBtn.css("display","block");
    var t = e.originalEvent.touches[0];
    var x = t.pageX - $(e.target).offset().left;
    var y = t.pageY - $(e.target).offset().top;
    canvasContext.lineTo(x,y);
    canvasContext.stroke();

    e.preventDefault();
    return false;
   });

   canvas.on('touchend', function (e) {
    if(leftMButtonDown) {
      leftMButtonDown = false;
      isSign = true;
    }

   });

   clearBtn.on("click", function(e) {
     canvasContext.clearRect(0, 0, canvas.width(), canvas.height());
     var x = [];
     var y = [];
     var t = [];
   });

}


$(document).ready(function () {
    init_Sign_Canvas();
});









/*const validBtn = $("submit");
const clearBtn = $("#clear");
const canvas = $("canvas");
const ctx = canvas[0].getContext("2d");

// On stocke la position de la souris dans un array lors du "mousedown"
canvas.mousedown(function(e){
  var mouseX = e.pageX - this.offsetLeft;
  var mouseY = e.pageY - this.offsetTop;

  paint = true;
  addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
  redraw();
});

canvas.mousemove(function(e){
  if(paint){
    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
    redraw();
  }
});

//la souris n'est pas pressée donc on stoppe le addClick
canvas.mouseup(function(e){
  paint = false;
});

//la souris quitte le canvas donc on stoppe le addClick
canvas.mouseleave(function(e){
  paint = false;
});

//On créer un array pour chaque position de la souris
var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var paint;

function addClick(x, y, dragging)
{
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
}

//Affiche le trait
function redraw(){
  ctx.clearRect(0, 0, canvas.width(), canvas.height()); // Clears the canvas

  ctx.strokeStyle = "grey";
  ctx.lineJoin = "round";
  ctx.lineWidth = 3;

  for(var i=0; i < clickX.length; i++) {
    ctx.beginPath();
    if(clickDrag[i] && i){
      ctx.moveTo(clickX[i-1], clickY[i-1]);
     }else{
       ctx.moveTo(clickX[i]-1, clickY[i]);
     }
     ctx.lineTo(clickX[i], clickY[i]);
     ctx.closePath();
     ctx.stroke();
  }
}

// Efface le canvas au click sur clear
clearBtn.click(function () {
    ctx.clearRect(0, 0, canvas.width(), canvas.height());
    validBtn.css("display","none");
  });*/
