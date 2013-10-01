// 
// Basic usage
//

// refence our library relative, but should be different once
// installed via npm require('game-loop-dispatch');
var GameLoopDispatch = require('../index.js');

var gameLoop = new GameLoopDispatch({
    // only require value is the interval in milliseconds
    'interval':1000
});

gameLoop.tick = function(){
    console.log('tick');
};

gameLoop.start();


