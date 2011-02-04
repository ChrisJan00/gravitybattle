var Player = function(x,y) {
	var self = this;
	self.keys = GLOBAL.keyManager.appendMapping([
		["up", 38],
		["down", 40],
		["left", 37],
		["right", 39],
		["action1", 75],
		["action2", 76]
	] );
	self.animationStrip = new Image();
    self.animationStrip.src = "graphics/Player.png";
	
	self.x = x;
	self.y = y;
	self.ix = x;
	self.iy = y;
	self.vx = 0;
	self.vy = 0;
	self.speed = 200;
	self.w = 16;
	self.h = 16;
	self.frameCount = 9;
	self.currentFrame = 0;
	
	self.update = function(dt) {
		var dts = dt/1000;
		
		self.vx = 0;
		self.vy = 0;
		if (self.keys.check("up"))
			self.vy = -1;
		if (self.keys.check("down"))
			self.vy = 1;
		if (self.keys.check("left"))
			self.vx = -1;
		if (self.keys.check("right"))
			self.vx = 1;
			
		self.x = Math.floor(self.x + self.vx * self.speed * dts + 0.5);
		self.y = Math.floor(self.y + self.vy * self.speed * dts + 0.5);
	}
	
    self.draw = function(dt) {
		var dts = dt/1000;
		
		if ((self.ix >=0) && (self.ix+self.w<=GLOBAL.canvasWidth) && (self.iy>=0) && (self.iy+self.h<=GLOBAL.canvasHeight))
			GLOBAL.gameContext.drawImage(GLOBAL.bgCanvas, self.ix, self.iy, self.w, self.h, self.ix, self.iy, self.w, self.h); 

		self.ix = Math.floor(self.x + self.vx * self.speed * dts + 0.5);
		self.iy = Math.floor(self.y + self.vy * self.speed * dts + 0.5);
		
		if ((self.ix>=0) && (self.ix+self.w<=GLOBAL.canvasWidth) && (self.iy>=0) && (self.iy+self.h<=GLOBAL.canvasHeight)) {
			GLOBAL.gameContext.drawImage(self.animationStrip, self.currentFrame*self.w, 0, self.w, self.h, self.ix, self.iy, self.w, self.h);
		}
	
	}
	
};
