var Level = function() {
	var self=this;
	self.tiles = new Image();
    self.tiles.src = "graphics/Tiles.png";
	
	self.blockSide = 16;
	
	// fill up an image
	self.init = function() {
		self.canvas = document.createElement("canvas");
		self.ctx = self.canvas.getContext("2d");
		self.canvas.width = GLOBAL.canvasWidth;
		self.canvas.height = GLOBAL.canvasHeight;
		
		self.rows = GLOBAL.mainMap.length;
		self.cols = GLOBAL.mainMap[0].length;
		
		var bs = self.blockSide;
		for (var jj=0;jj<GLOBAL.mainMap.length;jj++)
			for (var ii=0;ii<GLOBAL.mainMap[jj].length;ii++) {
				var a = GLOBAL.mainMap[jj][ii];
				self.ctx.drawImage(self.tiles, a*bs, 0, bs, bs,
					ii*bs,jj*bs,bs,bs);
			}
			
		GLOBAL.bgContext.drawImage(self.canvas, 0, 0, GLOBAL.canvasWidth, GLOBAL.canvasHeight);
		GLOBAL.gameContext.drawImage(self.canvas, 0, 0, GLOBAL.canvasWidth, GLOBAL.canvasHeight);
	}
	
	
	self.update = function(dt) {
		// nothing to do
	}
	
	self.draw = function(dt) {
		// nothing to do because we are using the game background
	}
	
	self.collided = function( x,y,w,h ) {
		// returns true if sprite collides with the map
		
		var sX1 = Math.max(Math.floor(x/self.blockSide), 0);
		var sY1 = Math.max(Math.floor(y/self.blockSide), 0);
		var sX2 = Math.min(Math.floor((x+w-1)/self.blockSide), self.cols-1);
		var sY2 = Math.min(Math.floor((y+h-1)/self.blockSide), self.rows-1);
		
		for (var jj=sY1; jj<=sY2; jj++)
			for (var ii=sX1; ii<=sX2; ii++)
				if ( GLOBAL.mainMap[jj][ii] > 0 )
					return true;
		
		return false;
	}
};