var Pixelated = function( conf ) {
	
	var X = conf && conf.width || 16;
	var Y = conf && conf.height || 9;
	var colors = conf && conf.colors || ['red','green','blue','yellow','violet','orange'];
	var leftQty = conf && conf.maxTries || 29;
	var table = buildTable();
	var events = [];
	var lastColor;
	function buildTable() {
		var table = [];
		for (var x=0; x< X; x++){
			table[x] = [];
			for (var y=0; y< Y; y++){
				cl = getAnyColor();
				table[x][y]=cl;
			}
		}
		return table;
	}

	function getAnyColor() {
		var idx = Math.floor(Math.random()* (colors.length));
		return colors[idx];
	}
	//Change all of this. For only check the portiontion of table that maybe change
	function checkNeighboards(checkedPixels,x,y,color){
		var paintedArea = [];
		
		if(table[x][y]!=color)
			return paintedArea;
		
		if(checkedPixels[x] && checkedPixels[x][y])
			return paintedArea;
		if(!checkedPixels[x])
			checkedPixels[x] = [];
		checkedPixels[x][y]=true;
		
		if( x>0 )
			paintedArea = paintedArea.concat(checkNeighboards(checkedPixels,x-1,y,color));
		if( y>0 )
			paintedArea = paintedArea.concat(checkNeighboards(checkedPixels,x,y-1,color));
		if( y<Y-1 )
			paintedArea = paintedArea.concat(checkNeighboards(checkedPixels,x,y+1,color));
		if( x<X-1 )
			paintedArea = paintedArea.concat(checkNeighboards(checkedPixels,x+1,y,color));
		
		paintedArea.push({'x':x,'y':y});
			
		return paintedArea;
	}
	function getPaintedArea(){
		var backColor = table[0][0];

		var paintedArea = checkNeighboards([],0,0,backColor);	

		return paintedArea;
	}
	function triggEvent(event,data){
		if( events[event] )
			events[event](data);
	}
	this.getTable = function() {
		return table;
	}
	this.getMoves = function () {
		return leftQty;
	}
	this.getColors = function (){
		return colors;
	}
	this.on = function(event,cbk){
		events[event] = cbk;
	}
	this.getLeftMoves = function(){
		return leftQty;
	}
	
	this.paintTo = function( color ){
		
		if(lastColor===color)
			return;
		lastColor = color;
		
		var paintedArea = getPaintedArea();
		
		for (var x in paintedArea){
			table[paintedArea[x].x][paintedArea[x].y]=color;
		}
		
		triggEvent('TableChange',{'color':color,'area':paintedArea});
		
		var paintedAreaLength = getPaintedArea().length;
		
		if(paintedAreaLength == X*Y)
			triggEvent('Win');
		leftQty--;
		
		if(leftQty==0){
			triggEvent('GameOver');
		}
		triggEvent('LeftUpdate',leftQty);
		
	}
	this.printTable = function(table){
		var dbg = [];
		var width = getMaxLength();
		for (var y=0; y< Y; y++){
			for (var x=0; x< X; x++){
				dbg.push(table[x][y]);
				dbg = dbg.concat(getBlanks(width - table[x][y].length));
				dbg.push('|');
			}
			dbg.push('\n');
		}
		console.log(dbg.join(''));
	}
	this.paintedAre2Table = function(obj) {
		var table = [];
		for (var x=0; x< X; x++){
			table[x] = [];
			for (var y=0; y< Y; y++){
				table[x][y]='';
			}
		}
		for (var i=0; i< obj.length; i++){
			table[obj[i].x][obj[i].y]='X';
		}
		return table;
	}
	function getBlanks(num){
		var blanks = [];
		for(var i=0; i<num;i++){
			blanks.push(' ');
		}
		return blanks;
	}
	function getMaxLength(){
		var length = 0;
		for(var i=0; i<colors.length;i++){
			length = Math.max(length,colors[i].length);
		}
		return length;
	}
};
