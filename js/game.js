//Game class constructor that will be used to run the game and pull in data for all aspects of tetris
var stateNumber = 0
var Game = function (canvasID) {
  //add tetris soundtrack to game and loop it.
  // var audio = new Audio('../assets/tetristoneloop.mp3');
  var audio = document.createElement('audio')
  audio.setAttribute('href', '../assets/tetristoneloop.mp3')

  //save variables that will be used for the canvas
  var canvas = document.getElementById('screen')
  var screen = canvas.getContext('2d')
  var gameSize = { x: canvas.width, y: canvas.height }

  ///----------------------------///
  ///  *** KEYBOARD MOVEMENT *** ///
  ///----------------------------///
  //addEventListener to window for keypress to move each tetris piece.
  window.addEventListener('keydown', movePiece, false)
  function movePiece(e) {
    var currentPositionArray = self.currentPiece.currentPositionArray
    var counter = 0

    console.log('audio')
    audio.loop = true
    audio.play()

    //added a switch that checks the x position of each block to make sure it is within the width of the canvas
    switch (e.keyCode) {
      //move the current piece left on left arrow key press
      case 37:
        for (var i = 0; i < currentPositionArray.length; i++) {
          if (currentPositionArray[i][0] > 0) {
            counter++
          }
        }
        if (counter === 4) {
          self.currentPiece.position.x--
        }
        break

      //rotate the current piece on up arrow key press
      case 38:
        stateNumber++
        if (self.currentPiece.states[stateNumber] === undefined) {
          stateNumber = 0
        }
        self.currentState = self.currentPiece.states[stateNumber]
        break

      //move the current piece right on right arrow key press
      case 39:
        for (var j = 0; j < currentPositionArray.length; j++) {
          if (currentPositionArray[j][0] + 30 < gameSize.x) {
            counter++
          }
        }
        if (counter === 4) {
          self.currentPiece.position.x++
        }
        break

      //move the current piece down on down arrow key press
      case 40:
        self.currentPiece.position.y++
        break
    }
  }

  this.pieces = [new Tetrominoes()]
  this.currentPiece = this.pieces[0]
  this.currentBlock = this.currentPiece.block
  this.stateNumber = this.currentPiece.stateNumber
  this.currentState = this.currentPiece.currentState
  this.locked = []
  this.nextPosition = []
  this.fullRows = []

  var self = this

  //function to run the game at 60 FPS
  var tick = function () {
    self.update()

    if (self.checkLoss(screen)) {
      cancelAnimationFrame(tick)
      audio.pause()
      var endAudio = new Audio('../tetris/assets/wah wah sound.mp3')
      endAudio.play()
      screen.clearRect(0, 0, gameSize.x, gameSize.y)
      var gameOver = 'images/over.png'
      $('canvas').css('background-image', 'url(' + gameOver + ')')
    } else {
      self.draw(screen)
      self.grid(30, 'rgb(50, 65, 97)', canvas, screen)
      requestAnimationFrame(tick)
    }
  }

  //function to move tetromino down at a consistent pace.
  var down = function () {
    self.checkLines(gameSize)
    self.removeFullLines()
    self.currentPiece.update()
  }

  //intertval to move the tetromino down one space every x amount of milliseconds
  setInterval(down, 400)
  tick()
}

///--------------------------///
///  *** GAME PROTOTYPES *** ///
///--------------------------///

Game.prototype = {
  update: function () {
    //set the current piece each update
    for (var i = 0; i < this.pieces.length; i++) {
      if (this.pieces[i].current) {
        this.currentPiece = this.pieces[i]
      }
    }
    this.currentBlock = this.currentPiece.block
    var block = this.currentBlock
    var state = this.currentPiece.states[stateNumber]
    var sizeX = this.currentPiece.size.x
    var sizeY = this.currentPiece.size.y

    //update nextPosition blocks
    for (var r = 0; r < state.length; r++) {
      for (var c = 0; c < state[r].length; c++) {
        if (state[r][c]) {
          var x = (this.currentPiece.position.x + c) * sizeX
          var y = (this.currentPiece.position.y + r) * sizeY
          this.nextPosition.push([x, y, x + sizeX, y + sizeY])
        }
      }
    }

    //if there is no current piece, make the current position equal to the next position
    if (this.currentPiece.currentPositionArray.length === 0) {
      this.currentPiece.currentPositionArray = this.nextPosition

      //check to see if the next position array is colliding with the floor or any locked pieces. If checkcollision returns true. then lock the speed and push the current piece into the locked piece array.
    } else if (this.checkCollision()) {
      this.currentPiece.speed = 0
      this.currentPiece.current = false
      this.locked.push([this.currentPiece])
      stateNumber = 0
      createTetromino(this)
    } else {
      this.currentPiece.currentPositionArray = this.nextPosition
    }
  },

  draw: function (screen) {
    screen.clearRect(0, 0, 300, 600)
    var block = this.currentBlock
    var sizeX = this.currentPiece.size.x
    var sizeY = this.currentPiece.size.y
    var center = {}

    //draw piece currently falling from top
    //empty the nextPositionArray when done
    for (var i = 0; i < this.currentPiece.currentPositionArray.length; i++) {
      screen.beginPath()
      screen.fillStyle = block.color
      var x = this.currentPiece.currentPositionArray[i][0]
      var y = this.currentPiece.currentPositionArray[i][1]
      screen.rect(x, y, sizeX, sizeY)
      screen.closePath()
      screen.fill()
    }
    this.nextPosition = []

    //draw the tetrominoes that are in the locked array
    if (this.locked.length > 0) {
      for (var j = 0; j < this.locked.length; j++) {
        for (var k = 0; k < this.locked[j][0].currentPositionArray.length; k++) {
          screen.fillStyle = this.locked[j][0].block.color
          screen.beginPath()
          var sizeX = this.locked[j][0].size.x
          var sizeY = this.locked[j][0].size.y
          var x = this.locked[j][0].currentPositionArray[k][0]
          var y = this.locked[j][0].currentPositionArray[k][1]
          screen.rect(x, y, sizeX, sizeY)
          screen.closePath()
          screen.fill()
        }
      }
    }
  },

  checkCollision: function () {
    //check for collision with bottom of frame
    //only need to check the the y position of the last block in nextPosition
    if (this.nextPosition[3][3] > 600) {
      return true
    } else {
      //check the nextposition array to see if any of the blocks of the current piece are colliding with any pieces in the locked array.
      var collidingCounter = 0
      for (var k = 0; k < this.nextPosition.length; k++) {
        for (var i = 0; i < this.locked.length; i++) {
          for (var j = 0; j < this.locked[i][0].currentPositionArray.length; j++) {
            if (colliding(this.nextPosition[k], this.locked[i][0].currentPositionArray[j])) {
              //add one too colliding counter if the colliding function returns true
              collidingCounter++
            }
          }
        }
      }
      //if any pieces are collding than checkCollision will return true
      if (collidingCounter !== 0) {
        return true
      }
    }
  },

  //check to see if there are any rows that are filled
  checkLines: function (gameSize) {
    if (this.locked.length > 0) {
      for (var i = 0; i < gameSize.y; i += 30) {
        var counter = 0
        for (var j = 0; j < this.locked.length; j++) {
          for (var k = 0; k < this.locked[j][0].currentPositionArray.length; k++) {
            if (this.locked[j][0].currentPositionArray[k][1] === i) {
              counter++
            }
          }
        }
        if (counter === 10) {
          this.fullRows.push(i)
        }
      }
    }
  },

  //if a line is filled then remove the squares from that line and shift all the sqares above, down one line
  removeFullLines: function () {
    for (var i = 0; i < this.locked.length; i++) {
      for (var j = 0; j < this.fullRows.length; j++) {
        for (var k = 0; k < this.locked[i][0].currentPositionArray.length; k++) {
          if (this.locked[i][0].currentPositionArray[k][1] === this.fullRows[j]) {
            this.locked[i][0].currentPositionArray.splice(k, 1)
            k--
          } else if (this.locked[i][0].currentPositionArray[k][1] < this.fullRows[j]) {
            this.locked[i][0].currentPositionArray[k][1] += 30
          }
        }
      }
    }
    this.fullRows = []
  },

  //if the last locked piece is above the top of the canvas than the player loses
  checkLoss: function (screen, callback) {
    var lastIndex = 0
    var lastLockedPiece = this.locked[this.locked.length - 1]
    if (lastLockedPiece === undefined || lastLockedPiece[0].currentPositionArray.length === 0) {
      return false
    } else if (lastLockedPiece[0].currentPositionArray[0][1] < 0) {
      return true
    }
  },

  //draw the grid for the background of the game and on top of the pieces to show each block for each piece
  grid: function (pixelSize, color, canvas, screen) {
    // screen.clearRect(0, 0, 300, 600);
    screen.save()
    screen.lineWidth = 0.5
    screen.strokeStyle = color

    //horizontal lines on grid
    for (var i = 0; i <= canvas.height; i = i + pixelSize) {
      screen.beginPath()
      screen.moveTo(0, i)
      screen.lineTo(canvas.width, i)
      screen.closePath()
      screen.stroke()
    }

    //vertical lines
    for (var j = 0; j <= canvas.width; j = j + pixelSize) {
      screen.beginPath()
      screen.moveTo(j, 0)
      screen.lineTo(j, canvas.height)
      screen.closePath()
      screen.stroke()
    }
    screen.restore()
  },
}

window.onload = function () {
  new Game('screen')
}
