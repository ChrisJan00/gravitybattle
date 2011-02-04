var Player = function() {
	var self = this;
	self.keys = GLOBAL.keyManager.appendMapping([
		["up", 38],
		["down", 40],
		["left", 37],
		["right", 39],
		["action1", 75],
		["action2", 76]
	] );
	
	self.x = 0;
	self.y = 0;
	self.vx = 0;
	self.vy = 0;
	self.speed = 100;
	
	self.update = function(dt) {
		self.vx = 0;
		if (self.keys.check("up"))
			self.vy = -1;
		if (self.keys.check("down"))
			self.vy = 1;
		if (self.keys.check("left"))
			self.vx = -1;
		if (self.keys.check("right"))
			self.vx = 1;
			
		self.x = self.x + self.vx * self.speed * dt;
		self.y = self.y + self.vy * self.speed * dt;
	}
	self.draw = function(dt) {
		
	}
	
};
