var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var canvasWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var canvasHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
var requestAnimationFrame = window.requestAnimationFrame ||
                             window.mozRequestAnimationFrame ||
                             window.webkitRequestAnimationFrame ||
                             window.msRequestAnimationFrame;

var persons = [];
var numberOfFirefly = 30;
var birthToGive = 25;

var colors = [];
colors[2] = {
  'background': '#2F294F',
  1: 'rgba(74,49,89,',
  2: 'rgba(130,91,109,',
  3: 'rgba(185,136,131,',
  4: 'rgba(249,241,204,'
};

var colorTheme = 2;
var mainSpeed = 1;

function getRandomInt(min, max, exept) {
  var i = Math.floor(Math.random() * (max - min + 1)) + min;
  if (typeof exept !== "undefined") {
    if (typeof exept === 'number' && i === exept) {
      return getRandomInt(min, max, exept);
    } else if (typeof exept === "object" && (i >= exept[0] && i <= exept[1])) {
      return getRandomInt(min, max, exept);
    }
  }
  return i;
}

function Firefly(id) {
  this.id = id;
  this.width = getRandomInt(3, 6);
  this.height = this.width;
  this.x = getRandomInt(0, (canvas.width - this.width));
  this.y = getRandomInt(0, (canvas.height - this.height));
  this.speed = (this.width <= 10) ? 2 : 1;
  this.alpha = 1;
  this.alphaReduction = getRandomInt(1, 3) / 1000;
  this.color = colors[colorTheme][getRandomInt(1, colors[colorTheme].length - 1)];
  this.direction = getRandomInt(0, 360);
  this.turner = getRandomInt(0, 1) === 0 ? -1 : 1;
  this.turnerAmp = getRandomInt(1, 2);
  this.isHit = false;
  this.stepCounter = 0;
  this.changeDirectionFrequency = getRandomInt(1, 200);
  this.shape = 2;
  this.shadowBlur = getRandomInt(5, 25);
}

Firefly.prototype.stop = function() {
  this.update();
}

Firefly.prototype.walk = function() {
  var next_x = this.x + Math.cos(degToRad(this.direction)) * this.speed;
  var next_y = this.y + Math.sin(degToRad(this.direction)) * this.speed;

  if (next_x >= (canvas.width - this.width) && (this.direction < 90 || this.direction > 270)) {
    next_x = canvas.width - this.width;
    this.direction = getRandomInt(90, 270, this.direction);
  }
  // Similar conditions for other canvas limits

  this.x = next_x;
  this.y = next_y;

  this.stepCounter++;

  if (this.changeDirectionFrequency && this.stepCounter === this.changeDirectionFrequency) {
    this.turner = this.turner === -1 ? 1 : -1;
    this.turnerAmp = getRandomInt(1, 2);
    this.stepCounter = 0;
    this.changeDirectionFrequency = getRandomInt(1, 200);
  }

  this.direction += this.turner * this.turnerAmp;

  this.update();
}

Firefly.prototype.update = function() {
  context.beginPath();

  context.fillStyle = this.color + this.alpha + ")";
  context.arc(this.x + (this.width / 2), this.y + (this.height / 2), this.width / 2, 0, 2 * Math.PI, false);
  context.shadowColor = this.color + this.alpha + ")";
  context.shadowBlur = this.shadowBlur;
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;
  context.fill();

  if (this.id > 15) {
    this.alpha -= this.alphaReduction;
    if (this.alpha <= 0) this.die();
  }
}

Firefly.prototype.die = function() {
  persons[this.id] = null;
  delete persons[this.id];
}

function degToRad(deg) {
  return deg * (Math.PI / 180);
}

window.onload = function() {
  canvas.setAttribute('width', canvasWidth);
  canvas.setAttribute('height', canvasHeight);

  start();
}

function start() {
  instantiatePopulation();
  animate();
}

function instantiatePopulation() {
  for (var i = 0; i < numberOfFirefly; i++) {
    persons[i] = new Firefly(i);
  }
}

function animate() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  persons_order = persons.slice(0);
  persons_order.sort(function(a, b) {
    return a.y - b.y
  });

  for (var i in persons_order) {
    var u = persons_order[i].id;
    persons[u].walk();
  }

  requestAnimationFrame(animate);
}

canvas.onclick = function(e) {
  giveBirth(e, birthToGive);
}

function giveBirth(e, u) {
  var i = persons.length;
  persons[i] = new Firefly(i);
  persons[i].x = e.layerX;
  persons[i].y = e.layerY;

  if (u > 1) giveBirth(e, u - 1);
}
