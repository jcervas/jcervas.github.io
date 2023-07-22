var canvas;
var context;

function randomNumber(min, max) {
  return Math.floor(Math.random() * max) + min;
}

function updateImageData(imageData) {
  for (var i = 0; i < imageData.data.length; i += 4) {
    var number = randomNumber(0, 255);
    imageData.data[i] =
    imageData.data[i+1] = number;
    imageData.data[i+2] = number;
    imageData.data[i+3] = 255;
  }
}

function drawFrame() {
  var imageData = context.getImageData(0, 0, canvas.width, canvas.height);

  updateImageData(imageData);

    context.putImageData(imageData, 0, 0);

  requestAnimationFrame(drawFrame);
}

function init() {
    canvas = document.getElementById('canvas');
  context = canvas.getContext('2d');

  canvas.width = 500;
  canvas.height = 300;
  drawFrame();
}

window.addEventListener('load', init);
