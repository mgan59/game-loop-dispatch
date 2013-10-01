Game Loop Dispatch
==================

A low level game-loop for nodejs that provides the basic events. Game Loop Dispatch is small maybe 40 lines of code and just extends node's built-in EventEmitter.  Being able to modify/extend the event hooks one can customize the loop for their game.

# Install

Use npm

    npm install game-loop-dispatch

# Usage

The below code samples are included in the `examples` folder and can be run with the following

    node examples/basic.js
    node examples/advanced.js

## Basic Usage

To start with just include and instantiate the game loop

    var GameLoopDispatch = require('game-loop-dispatch');

    var gameLoop = new GameLoopDispatch({
        // only require value is the interval in milliseconds
        'interval':1000
    });

    gameLoop.tick = function(){
        console.log('tick');
    };

    gameLoop.start();

You should see in a stdout every second

    tick
    tick
    tick


## Advanced Usage

Advanced usage showing how you can add an additional event hooks to extend the loop functionality.  In this example we will add `tickStart` and `tickEnd` so that we can pause/start the gameloop while it is processing async calls.  Otherwise the loop would continue to fire every 1 sec and things would get out of control.


    var GameLoopDispatch = require('game-loop-dispatch');

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


## Todo / Contributions

This is an initial release as I'm prototyping a game.  Some additional low-level events are still needed such as some 'loader' event system for static content and or other async behavior.  Open to suggestions and ideally would like to build this like lodash where one can generate the game-loop function hooks they need.
