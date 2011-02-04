var GravityPile = function(x,y,n) {
	var self = this;
	
	self.tiles = new Image();
    self.tiles.src = "graphics/Tiles.png";
	self.blockSide = 16;
	
	self.pile = [];
	self.pileSize = 30;
	self.needsRedraw = true;
	
	self.x = x;
	self.y = y;
	self.w = self.blockSide;
	self.h = self.blockSide * self.pileSize;
	
	self.spawnTime = 5;
	self.timer = self.spawnTime;
	
	self.complete = function() {
		return self.tiles.complete;
	}
	
	self.addTile = function() {
		if (self.pile.length < self.pileSize) {
			self.pile.push( Math.floor(Math.random()*4) );
			self.needsRedraw = true;
		}
	}
	
	for (var ii=0;ii<n;ii++)
		self.addTile();
		
	self.getTile = function() {
		if (self.pile.length>0) {
			self.needsRedraw = true;
			return self.pile.shift();
		} else {
			return -1;
		}
	}
	
	self.update = function(dt) {
		self.timer = self.timer - dt/1000;
		if (self.timer <= 0) {
			self.timer = self.spawnTime;
			self.addTile();
		}
	}
	
	self.draw = function(dt) {
		if (!self.needsRedraw) return;
		// erase column
		GLOBAL.gameContext.drawImage(GLOBAL.bgCanvas, self.x, self.y, self.w, self.h, self.x, self.y, self.w, self.h); 
		for (var ii=0;ii<self.pile.length;ii++) {
			GLOBAL.gameContext.drawImage(self.tiles, (self.pile[ii]+12)*self.blockSide, 0, self.blockSide, self.blockSide,
				self.x, self.h-(ii+1)*self.blockSide, self.blockSide, self.blockSide);
		}
	}
};