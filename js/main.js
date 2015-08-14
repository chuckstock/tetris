//Game class constructor that will be used to run the game and pull in data for all aspects of tetris
var Game = function(canvasID) {
  var canvas = document.getElementById("screen");
  var screen = canvas.getContext("2d");
  var gameSize = { x: canvas.width, y: canvas.height }

  this.pieces = [new Tetrominoes()];
  this.currentPiece;
  for (var i = 0; i < this.pieces.length; i++) {
    if (this.pieces[i].current) {
        this.currentPiece = this.pieces[i];
    }
  }
  this.currentBlock = this.currentPiece.block;
  this.locked = [];
  this.currentlyFilled = [];

  var self = this;

  //function to run the game at 60 FPS
  var tick = function() {
    self.update();
    self.draw(screen);
    self.grid(30, "black", canvas, screen);

  }

  //intertval to move the tetromino down one space every 750ms
  setInterval(tick, 50);
}

Game.prototype = {
  update: function() {
    var block = this.currentBlock;
    var sizeX = this.currentPiece.size.x;
    var sizeY = this.currentPiece.size.y;
    //update the block to redraw it as it moves down the frame
    this.currentPiece.update();

    //update currentlyFilled blocks
    for (var r = 0; r < block.matrix.length; r++) {
      for (var c = 0; c < block.matrix[r].length; c++) {
        if (block.matrix[r][c]) {
          var x = (this.currentPiece.position.x + c) * sizeX;
          var y = (this.currentPiece.position.y + r) * sizeY;
          this.currentlyFilled.push([x, y, x + sizeX, y + sizeY]);
        }
      }
    }
    //check to see if the bodies are colliding with anything.
    if (this.checkCollision()) {
      this.currentPiece.speed = 0;
      this.currentPiece.current = false;
      this.locked.push(this.pieces)
      createTetromino(this);
    }

  },

  draw: function(screen) {
    screen.clearRect(0, 0, 300, 600);
    var block = this.currentBlock;
    var sizeX = this.currentPiece.size.x;
    var sizeY = this.currentPiece.size.y;
    var center = {};

    // this.center = {x: gameSize.x / 2, y: gameSize.y - this.size.x};
    //draw piece currently falling from top
    for (var i = 0; i < this.currentlyFilled.length; i++) {
      screen.fillStyle = block.color;
      screen.beginPath();
      var x = this.currentlyFilled[i][0];
      var y = this.currentlyFilled[i][1];
      screen.rect(x, y, sizeX, sizeY);
      screen.closePath();
      screen.fill();
    }
    this.currentlyFilled = [];

    //draw pieces that are on the board
    for (var r = 0; r < this.locked.length; r++) {
      for (var c = 0; c < this.locked[r].length; c++) {
        screen.fillStyle = block.color;
        screen.beginPath();
        var x = this.locked[r][c][0];
        var y = this.locked[r][c][1];
        screen.rect(x, y, sizeX, sizeY);
        screen.closePath();
        screen.fill();
        this.currentlyFilled.push([x, y, x + sizeX, y + sizeY])
      }
    }

  },

  checkCollision: function() {
    if (this.locked.length === 0 && this.currentlyFilled) {
      //check for collision with bottom of frame
      //only need to check the the y position of the last block in in currentlyFilled
      return (this.currentlyFilled[3][3] >= 600);
    }
  },


  grid: function(pixelSize, color, canvas, screen) {
    // screen.clearRect(0, 0, 300, 600);
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

var Tetrominoes = function() {
  var random = Math.floor(Math.random() * blocks.length);
  this.block = blocks[random];
  this.position = {x: 3, y: -4};
  this.speed = 1;
  this.size = {x: 30, y: 30};
  this.current = true;

}

Tetrominoes.prototype = {
  update: function() {
    this.position.y += this.speed;
    //
    // //once a block is stopped, create a new tetromino
    // if (true) {
    //
    // }
  }

}

var createTetromino = function(game) {
  var newPiece = new Tetrominoes();
  game.pieces.push(newPiece);
}

var colliding = function(b1, b2) {
  return !(
    b1 === b2 ||
    b1.center.x + b1.size.x / 2 < b2.center.x - b2.size.x / 2  ||
    b1.center.y + b1.size.y / 2 < b2.center.y - b2.size.y / 2  ||
    b1.center.x - b1.size.x / 2 > b2.center.x + b2.size.x / 2  ||
    b1.center.y - b1.size.y / 2 > b2.center.y + b2.size.y / 2
  );
};

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
