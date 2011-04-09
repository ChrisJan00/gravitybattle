var AnimationControl = function(indices) {
	var self = this;
	self.frameIndices = indices.slice();
	self.frameIndex = 0;
	self.updateFrame = function() {
		self.frameIndex = (self.frameIndex+1)%self.frameIndices.length;
	}
	self.currentFrame = function() {
		return self.frameIndices[self.frameIndex];
	}
}

var Player = function(x,y) {
	var self = this;
	// self.keys = GLOBAL.keyManager.appendMapping([
		// ["up", 38],
		// ["down", 40],
		// ["left", 37],
		// ["right", 39],
		// ["action1", 75],
		// ["action2", 76]
	// ] );
	self.keys = new( function() { this.check = function( str ) { return false; } } );
	self.animationStrip = new Image();
    self.animationStrip.src = "graphics/Player1.png";
    self.standingIndices = new AnimationControl([0]);
	self.walkingIndices = new AnimationControl([1,2,3]);
	self.jumpingIndices = new AnimationControl([4,5,6]);
	self.dyingIndices = new AnimationControl([7,8]);
	self.animationControl = self.standingIndices;
	
	self.x = x;
	self.y = y;
	self.ix = x;
	self.iy = y;
	self.vx = 0;
	self.vy = 0;
	self.speed = 200;
	self.drag = 0.04;
	self.accel = 0.1;
	self.w = 16;
	self.h = 16;
	self.frameCount = 9;
	self.currentFrame = 0;
	self.dts = 0;
	self.gravityBlock = false;
	self.gravityCap = 2;
	self.jumpStrength = 1.15;
	self.frameDelay = 100;
	self.frameTimer = self.frameDelay;
	
	self.gravityPile = new GravityPile(0,0,10);
	
	self.complete = function() {
		if (!self.animationStrip.complete)
			return false;
		if (!self.gravityPile.complete)
			return false;
		return true;
	}
	
	self.update = function(dt) {
		self.dts = dt/1000;
		
		self.parseKeys();	
		self.applyGravity();
		
		var candidatePos = self.updatedPos();
		if (!GLOBAL.level.collided(candidatePos.x,candidatePos.y,self.w,self.h)) {
			self.x = candidatePos.x;
			self.y = candidatePos.y;
		} else if (!GLOBAL.level.collided(candidatePos.x,self.y,self.w,self.h)) {
			self.x = candidatePos.x;
			self.vy = 0;
		} else if (!GLOBAL.level.collided(self.x,candidatePos.y,self.w,self.h)) {
			self.vx = 0;
			self.y = candidatePos.y;
		} else {
			self.vx = 0;
			self.vy = 0;
		}
		
		self.gravityPile.update(dt);
		// TESTING: change gravity direction
		if (self.keys.check("action1")) {
			if (!self.gravityBlock) {
				self.gravityBlock = true;
				var newDir = self.gravityPile.getTile();
				if (newDir != -1)
					GLOBAL.gravityDir = newDir;
				// GLOBAL.gravityDir = (GLOBAL.gravityDir+1)%4;
			}
		} else if (self.keys.check("action2")) {
			if (!self.gravityBlock) {
				self.gravityBlock = true;
				self.gravityPile.getTile();
			}
		} else {
			self.gravityBlock = false;
		}
		
		// animation
		self.frameTimer -= dt;
		if (self.frameTimer<=0) {
			self.updateFrame();
			self.frameTimer = self.frameDelay;
		}
	}
	
	self.updateFrame = function() {
		if (self.standing()) {
			if (self.vx!=0) {
				self.animationControl = self.walkingIndices;
			} else {
				self.animationControl = self.standingIndices;
			}
		} else {
			self.animationControl = self.jumpingIndices;
		}
		
		self.animationControl.updateFrame();
	} 
	
	self.updatedPos = function() {
		var retVal = {}
		retVal.x = Math.floor(self.x + self.vx * self.speed * self.dts + 0.5);
		retVal.y = Math.floor(self.y + self.vy * self.speed * self.dts + 0.5);
		return retVal;
	}
	
	self.standing = function() {
		switch(GLOBAL.gravityDir) {
		case 0:
			return GLOBAL.level.collided(self.x, self.y + self.speed*self.dts, self.w, self.h);
		case 1:
			return GLOBAL.level.collided(self.x, self.y - self.speed*self.dts, self.w, self.h);
		case 2:
			return GLOBAL.level.collided(self.x - self.speed*self.dts, self.y, self.w, self.h);
		case 3:
			return GLOBAL.level.collided(self.x + self.speed*self.dts, self.y, self.w, self.h);
		}
	}
	
	self.applyGravity = function() {
		switch(GLOBAL.gravityDir) {
			case 0: self.vy = Math.min(self.gravityCap, self.vy + self.dts * GLOBAL.gravity/self.speed); break;
			case 1: self.vy = Math.max(-self.gravityCap, self.vy - self.dts * GLOBAL.gravity/self.speed); break;
			case 2: self.vx = Math.max(-self.gravityCap, self.vx - self.dts * GLOBAL.gravity/self.speed); break;
			case 3: self.vx = Math.min(self.gravityCap, self.vx + self.dts * GLOBAL.gravity/self.speed); break;
		}
	}
	
	self.parseKeys = function() {
		switch(GLOBAL.gravityDir) {
			case 0:
			case 1:
				var mx = 0;
				if (GLOBAL.gravityDir==0 && self.keys.check("up") && self.standing(self.dts))
					self.vy = -self.jumpStrength;
				if (GLOBAL.gravityDir==1 && self.keys.check("down") && self.standing(self.dts))
					self.vy = self.jumpStrength;
				if (self.keys.check("left"))
					mx = -1;
				if (self.keys.check("right"))
					mx = 1;
				
				self.vx = self.vx + mx * self.accel;
				
				if (self.vx-self.drag>0)
					self.vx -= self.drag;
				else if (self.vx+self.drag<0)
					self.vx += self.drag;
				else
					self.vx = 0;
				
				if (self.vx>1) self.vx=1;
				if (self.vx<-1) self.vx=-1;
			break;
		
			case 2:
			case 3:
				var my = 0;
				if (self.keys.check("up"))
					my = -1;
				if (self.keys.check("down"))
					my = 1;
				if (GLOBAL.gravityDir==2 && self.keys.check("right") && self.standing(self.dts))
					self.vx = self.jumpStrength;
				if (GLOBAL.gravityDir==3 && self.keys.check("left") && self.standing(self.dts))
					self.vx = -self.jumpStrength;
					
				self.vy = self.vy + my * self.accel;
				
				if (self.vy-self.drag>0)
					self.vy -= self.drag;
				else if (self.vy+self.drag<0)
					self.vy += self.drag;
				else
					self.vy = 0;
				
				if (self.vy>1) self.vy=1;
				if (self.vy<-1) self.vy=-1;
				
				break;
		}
	}
	
	self.undraw = function(dt) {
		if ((self.ix >=0) && (self.ix+self.w<=GLOBAL.canvasWidth) && (self.iy>=0) && (self.iy+self.h<=GLOBAL.canvasHeight))
			GLOBAL.gameContext.drawImage(GLOBAL.bgCanvas, self.ix, self.iy, self.w, self.h, self.ix, self.iy, self.w, self.h); 
	}
	
    self.draw = function(dt) {
		self.dts = dt/1000;

		var candidatePos = self.updatedPos(); 
		self.ix = candidatePos.x;
		self.iy = candidatePos.y;
		
		if ((self.ix>=0) && (self.ix+self.w<=GLOBAL.canvasWidth) && (self.iy>=0) && (self.iy+self.h<=GLOBAL.canvasHeight)) {
			GLOBAL.gameContext.drawImage(self.animationStrip, 
				self.animationControl.currentFrame()*self.w, 0, self.w, self.h, self.ix, self.iy, self.w, self.h);
		}
	
		self.gravityPile.draw(dt);
	}
	
};
