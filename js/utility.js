//create a new tetromino and push it into the pieces array for the game
var createTetromino = function(game) {
  var newPiece = new Tetrominoes();
  game.pieces.push(newPiece);
};

//function to check two boddies are colliding will only return true of all 5 of the condition are false
var colliding = function(b1, b2) {
  return !(
    b1 === b2 ||
    b1[0] + 30 <= b2[0]  ||
    b1[1] + 30 <= b2[1]  ||
    b1[0] >= b2[0] + 30  ||
    b1[1] >= b2[1] + 30
  );
};
