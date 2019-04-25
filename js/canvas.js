const canvas = $("canvas");
const clearBtn = $("#clear");
const subBtn = $('#submit');
const canvasContext = canvas[0].getContext("2d");
subBtn.css("display", "none");

function init_Sign_Canvas() {
  isSign = false;
  leftMButtonDown = false;

  // Bind Mouse events
  canvas.on('mousedown', function (e) {
    if (e.which === 1) {
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
    if (leftMButtonDown && e.which === 1) {
      leftMButtonDown = false;
      isSign = true;
    }
    e.preventDefault();
    return false;
  });

  // draw a line from the last point to this one
  canvas.on('mousemove', function (e) {
    if (leftMButtonDown == true) {
      subBtn.css("display", "block");
      canvasContext.fillStyle = "#000";
      var x = e.pageX - $(e.target).offset().left;
      var y = e.pageY - $(e.target).offset().top;
      canvasContext.lineTo(x, y);
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
    subBtn.css("display", "block");
    var t = e.originalEvent.touches[0];
    var x = t.pageX - $(e.target).offset().left;
    var y = t.pageY - $(e.target).offset().top;
    canvasContext.lineTo(x, y);
    canvasContext.stroke();

    e.preventDefault();
    return false;
  });

  canvas.on('touchend', function (e) {
    if (leftMButtonDown) {
      leftMButtonDown = false;
      isSign = true;
    }

  });

  clearBtn.on("click", function (e) {
    canvasContext.clearRect(0, 0, canvas.width(), canvas.height());
    canvasContext.beginPath();
  });

}


$(document).ready(function () {
  init_Sign_Canvas();
});
