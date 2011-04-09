
GLOBAL.levelEditor = new function()
{
	var self = this;
	self.level = new Level();
	
	self.mouse = {
		x:0,
		y:0,
		pressed:false,
		shiftKey:false
	};
	self.cursorPos = {
		x:0,
		y:0,
	}
	self.tileSelected = [1,0];
	
	self.start = function() {
		if (!self.level.ready()) {
			setTimeout(self.start, 200);
			return;
		}
		
		GLOBAL.gameCanvas = document.getElementById("canvas1");
		GLOBAL.gameCanvas.x = GLOBAL.findAbsoluteX(GLOBAL.gameCanvas);
		GLOBAL.gameCanvas.y = GLOBAL.findAbsoluteY(GLOBAL.gameCanvas);
		
		self.baseWidth = GLOBAL.gameCanvas.width;
		self.baseHeight = GLOBAL.gameCanvas.height;
		// resize canvas to fit the tiles
		GLOBAL.gameCanvas.width = self.baseWidth + 
			(Math.floor(self.level.tiles.width / self.baseHeight)+1)*self.level.blockSide;
		
		GLOBAL.gameContext = GLOBAL.gameCanvas.getContext("2d");
		GLOBAL.bgCanvas = document.createElement('canvas');
		GLOBAL.bgCanvas.width = GLOBAL.gameCanvas.width;
		GLOBAL.bgCanvas.height = GLOBAL.gameCanvas.height;
		GLOBAL.bgContext = GLOBAL.bgCanvas.getContext("2d");
		GLOBAL.canvasWidth = GLOBAL.gameCanvas.width;
		GLOBAL.canvasHeight = GLOBAL.gameCanvas.height;
		
		// start with an empty background
		GLOBAL.bgContext.fillStyle = "#000000";
		GLOBAL.bgContext.fillRect(0, 0, GLOBAL.gameCanvas.width, GLOBAL.gameCanvas.height);
		
		self.level.init();
		self.tileCount = Math.floor(self.level.tiles.width / self.level.tiles.blockSide);
		self.drawLevel();
		self.drawTiles();
		self.dumpLevel();
		self.drawTileCursors();
		self.connectMouse();
		
		
	}
	
	self.drawLevel = function() {
		self.level.draw(0);
		
	}
	
	self.drawTiles = function() {
		var l = self.level;
		var bs = l.blockSide;
		var nTiles = Math.floor(l.tiles.width / bs);
		var nCols = Math.floor(nTiles / Math.floor(self.baseHeight/bs))+1;
		var ndx = 0;
		for (var j=0;j<nCols;j++)
			for (var i=0;i<nTiles;i++) {
				GLOBAL.bgContext.drawImage(l.tiles, ndx*bs, 0, bs, bs, self.baseWidth+j*bs,i*bs,bs,bs);
				GLOBAL.gameContext.drawImage(l.tiles, ndx*bs, 0, bs, bs, self.baseWidth+j*bs,i*bs,bs,bs);
				ndx++;
			}
	}
	self.i = 0;
	self.dumpLevel = function() {
		document.getElementById("levelButton").innerHTML = "Level Code";
		var outputString = "GLOBAL.mainMap = [";
		if (GLOBAL.mainMap.length==0)
			outputString +"];<br>"
		else {
			outputString += "<br>"
			var l = GLOBAL.mainMap.length;
			var m = GLOBAL.mainMap[0].length;
			for (var j=0;j<l;j++) {
				outputString+="[";
				for (var i=0;i<m;i++){
					outputString += GLOBAL.mainMap[j][i]+
						(i<m-1 ? "," : (j<l-1 ? "],<br>" : "]];<br>") );
				}
			}
		}
		document.getElementById("levelDump").innerHTML = outputString;
	}
	
	self.connectMouse = function() {
		GLOBAL.gameCanvas.addEventListener('mousedown', self.mouseDown, false);
		GLOBAL.gameCanvas.addEventListener('mouseup', self.mouseUp, false);
		GLOBAL.gameCanvas.addEventListener('mousemove', self.mouseMove, false);
	}
	
	self.mouseDown = function(ev) {
		self.mouseMove(ev);
		
		self.mouse.pressed = true;
		self.mouse.shiftKey = ev.shiftKey;
		
		if (self.mouse.x >= self.baseWidth) {
			self.setTileCursor(ev.shiftKey?1:0);
		} else {
			self.addTile(ev.shiftKey?1:0);
		}
	}
	
	self.mouseUp = function(ev) {
		self.mouse.pressed = false;
		//self.mouseMove(ev);
	}
	
	self.mouseMove = function(ev) {
		if (ev.layerX || ev.layerX == 0) { // Firefox
	    	self.mouse.x = ev.layerX - GLOBAL.gameCanvas.x;
	    	self.mouse.y = ev.layerY - GLOBAL.gameCanvas.y;
	  	} else if (ev.offsetX || ev.offsetX == 0) { // Opera
	    	self.mouse.x = ev.offsetX - GLOBAL.gameCanvas.x;
	    	self.mouse.y = ev.offsetY - GLOBAL.gameCanvas.y;
	  	}
	  	self.updateCursor();
	  	if (self.mouse.pressed) {
	  		self.addTile(self.mouse.shiftKey?1:0);
	  	}
	}
	self.limitRange = function(variable, min, max) {
		return variable<min?min: variable>max?max:variable;
	}
	
	self.updateCursor = function() {
		var newCursorPos = {
			x : Math.floor(self.mouse.x/self.level.blockSide),
			y : Math.floor(self.mouse.y/self.level.blockSide) 
			};
		if (newCursorPos.x == self.cursorPos.x && newCursorPos.y == self.cursorPos.y)
			return;
		// delete old cursor
		var bs = self.level.blockSide;
		var bd = GLOBAL.gameContext.lineWidth;
		var mx = self.limitRange(self.cursorPos.x*bs-bd, 0, self.baseWidth-1);
		var my = self.limitRange(self.cursorPos.y*bs-bd, 0, self.baseWidth-1);
		GLOBAL.gameContext.drawImage(GLOBAL.bgCanvas, 
			mx, my, bs+bd*2, bs+bd*2,
			mx, my, bs+bd*2, bs+bd*2);
		
		if (newCursorPos.x < 0 || newCursorPos.x>self.baseWidth/bs - 1 ||
			newCursorPos.y < 0 || newCursorPos.y>self.baseHeight/bs - 1)
				return;
		self.cursorPos = newCursorPos;
		self.drawCursor();
	}
	
	self.drawCursor = function() {
		var bs = self.level.blockSide;
		GLOBAL.gameContext.strokeStyle = "#FFFFFF";
		GLOBAL.gameContext.strokeRect(self.cursorPos.x*bs,self.cursorPos.y*bs, bs, bs);
	}
	
	self.setTileCursor = function(whichCursor) {
		var newCursorPos = {
			x : Math.floor((self.mouse.x - self.baseWidth)/self.level.blockSide),
			y : Math.floor(self.mouse.y/self.level.blockSide) 
			};
		var ndx = newCursorPos.x * Math.floor(self.baseHeight/self.level.blockSide) + newCursorPos.y;
		if (ndx<0 || ndx >= self.tileCount)
			return;
		
		GLOBAL.gameContext.drawImage(GLOBAL.bgCanvas, self.baseWidth-2, 0, GLOBAL.canvasWidth-self.baseWidth+2, GLOBAL.canvasHeight,
			self.baseWidth-2, 0, GLOBAL.canvasWidth-self.baseWidth+2, GLOBAL.canvasHeight);
			
		self.tileSelected[whichCursor] = ndx;
		self.drawTileCursors();
	}
	
	self.drawTileCursors = function() {
		var bs = self.level.blockSide;
		var rows = Math.floor(self.baseWidth/bs);
		
		var x = Math.floor(self.tileSelected[1]/rows);
		var y = self.tileSelected[1]%rows;
		GLOBAL.gameContext.strokeStyle = "#FF0000";
		GLOBAL.gameContext.strokeRect(self.baseWidth+x*bs, y*bs, bs, bs);
		
		x = Math.floor(self.tileSelected[0]/rows);
		y = self.tileSelected[0]%rows;
		GLOBAL.gameContext.strokeStyle = "#FFFFFF";
		GLOBAL.gameContext.strokeRect(self.baseWidth+x*bs, y*bs, bs, bs);
	}
	
	self.addTile = function(whichTile) {
		var x = self.cursorPos.x;
		var y = self.cursorPos.y;
		var a = self.tileSelected[whichTile];
		GLOBAL.mainMap[y][x] = a;
		var bs = self.level.blockSide;
		
		GLOBAL.fillStyle = "#000000";
		GLOBAL.bgContext.fillRect(x*bs, y*bs, bs, bs);
		GLOBAL.gameContext.fillRect(x*bs, y*bs, bs, bs);
		GLOBAL.bgContext.drawImage(self.level.tiles, a*bs, 0, bs, bs, x*bs, y*bs, bs, bs);
		GLOBAL.gameContext.drawImage(self.level.tiles, a*bs, 0, bs, bs, x*bs, y*bs, bs, bs);
		self.drawCursor();
					
		document.getElementById("levelButton").innerHTML = "Level Code (press to update)";
	}
}
