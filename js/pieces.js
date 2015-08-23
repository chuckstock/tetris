//class constructor for each tetromino
var Tetrominoes = function() {
  var random = Math.floor(Math.random() * blocks.length);
  this.block = blocks[random];
  this.position = {x: 3, y: -4};
  this.size = {x: 30, y: 30};
  this.currentPositionArray = [];
  this.speed = 1;
  this.stateNumber = 0;
  this.states = this.block.states;
  this.currentState = this.block.states[this.stateNumber];
  this.current = true;
};


Tetrominoes.prototype = {
  //update the y position of the tetromino for each tick of the game
  update: function() {
    this.position.y += this.speed;
  }
};

//all the blocks with their colors and a 4x4 matrix of what they look like
var blocks = [
  {
    name: "O",
    //the number one represents where a piece should be filled on the canvas
    states: [
      [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
      ]
    ],
    color: "yellow"
  },
  {
    name: "I",
    states: [
      [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ],
      [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0]
      ]
    ],
    color: "cyan"
  },
  {
    name: "T",
    states: [
      [
        [0, 0, 0, 0],
        [1, 1, 1, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0]
      ],
      [
        [0, 1, 0, 0],
        [1, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0]
      ],
      [
        [0, 1, 0, 0],
        [1, 1, 1, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ],
      [
        [0, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0]
      ]
    ],
    color: "purple"
  },
  {
    name: "S",
    states: [
      [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [1, 1, 0, 0],
        [0, 0, 0, 0]
      ],
      [
        [0, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 0]
      ]
    ],
    color: "green"
  },
  {
    name: "Z",
    states: [
      [
        [0, 0, 0, 0],
        [1, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
      ],
      [
        [0, 1, 0, 0],
        [1, 1, 0, 0],
        [1, 0, 0, 0],
        [0, 0, 0, 0]
      ]
    ],
    color: "red"
  },
  {
    name: "J",
    states: [
      [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
      ],
      [
        [0, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 1, 1, 0],
        [0, 0, 0, 0]
      ],
      [
        [1, 1, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [0, 0, 0, 0]
      ],
      [
        [1, 1, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ]
    ],
    color: "blue"
  },
  {
    name: "L",
    states:[
      [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
      ],
      [
        [0, 1, 1, 1],
        [0, 1, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ],
      [
        [0, 0, 1, 1],
        [0, 0, 0, 1],
        [0, 0, 0, 1],
        [0, 0, 0, 0]
      ],
      [
        [0, 0, 0, 0],
        [0, 0, 0, 1],
        [0, 1, 1, 1],
        [0, 0, 0, 0]
      ]
    ],
    color: "orange"
  },
];
