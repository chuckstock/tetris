//Game class constructor that will be used to run the game and pull in data for all aspects of tetris
var Game = function(canvasID) {
  var canvas = document.getElementById("screen");
  var screen = canvas.getContext("2d");
  var gameSize = { x: canvas.width, y: canvas.height }

  this.bodies = new Tetrominoes(this, gameSize);
  this.currentBlock = blocks[2];

  var self = this;

  //function to run the game at 60 FPS
  var tick = function() {
    self.update();
    self.grid(30, "black", canvas, screen);
    self.draw(screen)
    requestAnimationFrame(tick);
  }
  tick();
}

Game.prototype = {
  update: function() {

  },

  draw: function(screen) {
    var block = this.currentBlock;
    var sizeX = this.bodies.size.x;
    var sizeY = this.bodies.size.y;
    debugger;
    for (var r = 0; r < block.matrix.length; r++) {
      for (var c = 0; c < block.matrix[r].length; c++) {
        if (block.matrix[r][c]) {
          screen.fillStyle = block.color;
          screen.beginPath();
          var x = (0 + c) * sizeX;
          var y = (0 + r) * sizeY;
          screen.rect(x, y, sizeX, sizeY);
          screen.closePath();
          screen.fill();
        }
      }
    }
  },

  grid: function(pixelSize, color, canvas, screen) {
    screen.save();
    screen.lineWidth = 0.5;
    screen.strokeStyle = color;

    //horizontal lines on grid
    for (var i = 0; i <= canvas.height; i = i + pixelSize) {
      screen.beginPath();
      screen.moveTo(0, i);
      screen.lineTo(canvas.width, i);
      screen.closePath();
      screen.stroke();
    }

    //vertical lines
    for(var j = 0; j <= canvas.width; j = j + pixelSize) {
      screen.beginPath();
      screen.moveTo(j, 0);
      screen.lineTo(j, canvas.height);
      screen.closePath();
      screen.stroke();
    }
    screen.restore();
  }
}

var Tetrominoes = function(game, gameSize) {
  this.game = game;
  this.block;
  this.size = {x: gameSize.x / 10, y: gameSize.y / 20}
  this.currentBlock
  this.speed = 0.5;
}

Tetrominoes.prototype = {
  update: function() {
  }
}


var blocks = [
  {
    name: "O",
    matrix: [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0]
    ],
    color: "yellow"
  },
  {
    name: "I",
    matrix: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    color: "cyan"
  },
  {
    name: "T",
    matrix: [
      [0, 0, 0, 0],
      [1, 1, 1, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0]
    ],
    color: "purple"
  },
  {
    name: "S",
    matrix: [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0]
    ],
    color: "green"
  },
  {
    name: "Z",
    matrix: [
      [0, 0, 0, 0],
      [1, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0]
    ],
    color: "red"
  },
  {
    name: "J",
    matrix: [
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0]
    ],
    color: "blue"
  },
  {
    name: "L",
    matrix: [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0]
    ],
    color: "orange"
  },

]




window.onload = function() {
  new Game("screen");
}
