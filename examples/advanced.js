//
//  Advanced example showing event hooking and how to make gameLoop
//  pause till tick is complete
//
   
var GameLoopDispatch = require('../index.js');

var gameLoop = new GameLoopDispatch({
    // only require value is the interval in milliseconds
    'interval':1000
});

gameLoop.tick = function(){
    // hack to rescope this because of setTimeout 
    //var self = this; 

    // GameLoopDispatch extends eventEmitter so `emit` is
    // provided internally.  In this example a `tickStart`
    // event is emited at the start of every `tick` event
    this.emit('tickStart');
    
    // our standard tick marker
    console.log('tick');

    // imagine this was some async call to a processingQueue
    // for AI Entities or Player Movements that takes 4 seconds
    // to process
    setTimeout(function(){
        // now that everything was process broadcast
        // an event for tickEnd
        // note we use gameLoop because `this` is wrong context
        gameLoop.emit('tickEnd');
    }, 4000);
            
};

//
// Create Listeners for our new Event hooks
//
gameLoop.on('tickStart', function(){
    console.log('top of tick phase');
    // lets pause the loop while we process
    gameLoop.pause();

});

gameLoop.on('tickEnd', function(){
    console.log('end of tick phase');
    // now that tick is complete lets restart the loop
    gameLoop.start();
});

gameLoop.start();

