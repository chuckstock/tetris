//Game class constructor that will be used to run the game and pull in data for all aspects of tetris
var Game = function(canvasID) {
  var canvas = document.getElementById("screen");
  var screen = canvas.getContext("2d");
  var gameSize = { x: canvas.width, y: canvas.height }

  this.pieces = [new Tetrominoes()];
  this.currentPiece = this.pieces[0];
  this.currentBlock = this.currentPiece.block;
  this.locked = [];
  this.nextPosition = [];

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
    //set the current piece each update
    for (var i = 0; i < this.pieces.length; i++) {
      if (this.pieces[i].current) {
        this.currentPiece = this.pieces[i];
      }
    }
    this.currentBlock = this.currentPiece.block;
    var block = this.currentBlock;
    var sizeX = this.currentPiece.size.x;
    var sizeY = this.currentPiece.size.y;

    //update the block to redraw it as it moves down the frame
    this.currentPiece.update();

    //update nextPosition blocks
    for (var r = 0; r < block.matrix.length; r++) {
      for (var c = 0; c < block.matrix[r].length; c++) {
        if (block.matrix[r][c]) {
          var x = (this.currentPiece.position.x + c) * sizeX;
          var y = (this.currentPiece.position.y + r) * sizeY;
          this.nextPosition.push([x, y, x + sizeX, y + sizeY]);
        }
      }
    }

    //set the currentPostionArray of the CurrentPiece to what is currently filled;
    // this.currentPiece.currentPositionArray = this.nextPosition;

    //check to see if the bodies are colliding with anything.
    if (this.currentPiece.currentPositionArray.length === 0) {
      this.currentPiece.currentPositionArray = this.nextPosition;

    } else if (this.checkCollision()) {
      this.currentPiece.speed = 0;
      this.currentPiece.current = false;
      // this.currentPiece.currentPositionArray = this.nextPosition;
      this.locked.push([this.currentPiece])
      createTetromino(this);
    } else {
      this.currentPiece.currentPositionArray = this.nextPosition;
    }

  },

  draw: function(screen) {
    screen.clearRect(0, 0, 300, 600);
    var block = this.currentBlock;
    var sizeX = this.currentPiece.size.x;
    var sizeY = this.currentPiece.size.y;
    var center = {};

    //draw piece currently falling from top
    //empty the nextPositionArray when done
    for (var i = 0; i < this.currentPiece.currentPositionArray.length; i++) {
      screen.beginPath();
      screen.fillStyle = block.color;
      var x = this.currentPiece.currentPositionArray[i][0];
      var y = this.currentPiece.currentPositionArray[i][1];
      screen.rect(x, y, sizeX, sizeY);
      screen.closePath();
      screen.fill();
    }
    this.nextPosition = [];

    //draw the tetrominoes that are in the locked array
    if (this.locked.length > 0) {
      for (var j = 0; j < this.locked.length; j++) {
        for (var k = 0; k < 4; k++) {
          screen.fillStyle = this.locked[j][0].block.color;
          screen.beginPath();
          var sizeX = this.locked[j][0].size.x;
          var sizeY = this.locked[j][0].size.y;
          var x = this.locked[j][0].currentPositionArray[k][0];
          var y = this.locked[j][0].currentPositionArray[k][1];
          screen.rect(x, y, sizeX, sizeY);
          screen.closePath();
          screen.fill();
        }
      }
    }
  },

  checkCollision: function() {
    if (this.locked.length === 0) {
      //check for collision with bottom of frame
      //only need to check the the y position of the last block in innextPosition
      return (this.nextPosition[3][3] > 600);
    } else {
      var collidingCounter = 0;
      for (var k = 0; k < this.nextPosition.length; k++) {
        for (var i = 0; i < this.locked.length; i++) {
          for (var j = 0; j < 4; j++) {
            if(colliding(this.nextPosition[k], this.locked[i][0].currentPositionArray[j])) {
              collidingCounter++;
            }
          }
        }
      }
      if(collidingCounter !== 0) {
        return true;
      }
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
  this.size = {x: 30, y: 30};
  this.currentPositionArray = [];
  this.center = {x: this.position.x * this.size.x + this.size.x / 2, y: this.position.y * this.size.y + this.size.y / 2};
  this.speed = 1;
  this.current = true;

}

Tetrominoes.prototype = {
  update: function() {
    this.position.y += this.speed;
    this.center = {x: this.position.x * this.size.x + this.size.x / 2, y: this.position.y * this.size.y + this.size.y / 2};
  }

}

var createTetromino = function(game) {
  var newPiece = new Tetrominoes();
  game.pieces.push(newPiece);
}

var colliding = function(b1, b2) {
  return !(
    b1 === b2 ||
    b1[0] + 30 <= b2[0]  ||
    b1[1] + 30 <= b2[1]  ||
    b1[0] >= b2[0] + 30  ||
    b1[1] >= b2[1] + 30
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
