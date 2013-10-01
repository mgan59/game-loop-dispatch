/*
 *  GameLoopDispatch a base wrapper
 *  around event emitter
 *
 */
 
var util = require("util");
var events = require("events");

//
// @config should contain the following
//  --required--> `interval` in milliseconds
// 
function GameLoopDispatch(config) {
    events.EventEmitter.call(this);
    // this is our constructor so we can 
    // bind and pass args
    // rename app to something more config like
    this.config = config;
    this.mode = null;
}

util.inherits(GameLoopDispatch, events.EventEmitter);

/*
 *  Tick should be pretty much what everyone will want to override
 *  By default it will emit a single 'tick' event
 *  Create examples however of customizing tick to do what you want
 *  Such as a 'tickStart' and 'tickEnd' 
 */
GameLoopDispatch.prototype.tick = function() {
    // emit a 'tick' event for those listening
    this.emit('tick');
};

// load should have event hook to handle loading the state data and any
// other things.  Should act as a way to reload the state as well as called
GameLoopDispatch.prototype.load = function(){
    // provide a hook to load events
    this.emit('load');
};

// Public method to start game loop
// have start emit a load event (and once complete) 
// then initialize and set gameloop
// tick to run.
// seems like good default
GameLoopDispatch.prototype.start = function(){
    var self = this;
    
    // check if mode is null, if so then we should call first-time load
    // load can be async and should be defined as an event
    // set our mode
    self.mode = 'start';
    
    // emit a start event hook, incase there are listeners
    self.emit('start');
  
    // create our interval and store into class ref
    // SO -> http://stackoverflow.com/questions/2749244/javascript-setinterval-and-this-solution
    self.gameLoopInterval = setInterval(function(local){ 
        return function(){
            // could inject kwargs into tick if needed
            return local.tick(); 
        };
    }(self), self.config.interval);
  
};

// Public method to pause interval
GameLoopDispatch.prototype.pause = function(){
    this.mode='pause';
    clearInterval(this.gameLoopInterval);
    this.emit('pause');

};

module.exports = GameLoopDispatch;

