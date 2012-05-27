var Pixelated = function( conf ) {
	
	var X = conf && conf.width || 16;
	var Y = conf && conf.height || 9;
	var colors = conf && conf.colors || ['red','green','blue','yellow','violet','orange'];
	var leftQty = conf && conf.maxTries || 29;
	var table = buildTable();
	var events = [];
	var lastColor;
	var endGame = false;
	var MOVES = {
		LEFT : function(x,y){ return {x:x-1,y:y}},
		RIGHT : function(x,y){ return {x:x+1,y:y}},
		UP : function(x,y){ return {x:x,y:y+1}},
		DOWN : function(x,y){ return {x:x,y:y-1}},
	}
	
	function buildTable() {
		var table = [];
		for (var x=0; x< X*Y; x++){
			table[x] = getAnyColor();
		}
		return table;
	}

	function getAnyColor() {
		var idx = Math.floor(Math.random() * (colors.length));
		return colors[idx];
	}
	function hasSomething(pixelsToCheck, checkedPixels, x, y, move, color){
		var pos = {x:x,y:y};
		while( (pos = move.call(pos.x,pos.y)) && pox.x>-1 && pos.x< X-1 && pox.y>-1 && pos.y<Y-1){
			if( pixelsToCheck[pos.x][pos.y]!= undefined && checkedPixels[pos.x][pos.y]==undefined )
				return true;
		}
		
		return false;
	}
	//Change all of this. For only check the portiontion of table that maybe change
	function checkNeighboards(pixelsToCheck, checkedPixels,x,color){
		var paintedArea = {length:0,area:[]}; //Becasuse size of array count null / undefined positions
		if(pixelsToCheck[x]!=color)
			return paintedArea;
		
		if(checkedPixels[x])
			return paintedArea;
		checkedPixels[x]=true;
		
		if( x%X>0 ) //&& hasSomething(pixelsToCheck,checkedPixels,x-1,y,MOVES.LEFT,color))
			paintedArea = union(paintedArea,(checkNeighboards(pixelsToCheck,checkedPixels,x-1,color)));
		if( Math.floor(x/X)>0 )
			paintedArea = union(paintedArea,(checkNeighboards(pixelsToCheck,checkedPixels, x-X,color)));
		if( Math.floor(x/X)<Y-1 )
			paintedArea = union(paintedArea,(checkNeighboards(pixelsToCheck,checkedPixels,x+X,color)));
		if( x%X<X-1 )
			paintedArea = union(paintedArea,(checkNeighboards(pixelsToCheck,checkedPixels,x+1,color)));
		
		paintedArea.area[x] = true;
		paintedArea.length++;
		
		return paintedArea;
	}
	function getPaintedArea(){
		var backColor = table[0];

		var paintedArea = checkNeighboards(table,[],0,backColor);	

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
	this.getWidth = function(){
		return X;
	}
	
	this.paintTo = function( color ){
		
		if( lastColor === color || endGame )
			return;
		
		lastColor = color;

		leftQty--;
		triggEvent('LeftUpdate',leftQty);
		
		var paintedArea = getPaintedArea();
		
		for (var i in paintedArea.area){
			table[i]=color;
		}
		
		triggEvent('TableChange',{'color':color,'area':paintedArea.area});
		
		var newPaintedArea = getPaintedArea();
		
		if(newPaintedArea.length == X*Y){
			triggEvent('Win');
			endGame  = true;
		} else if(leftQty==1){
			triggEvent('GameOver');
			endGame  = true;
		}
		
		this.printTable(table);
		
	}
	this.printTable = function(table){
		var dbg = [];
		var width = getMaxLength();
		for (var x=0; x< X*Y; x++){
			if( (x % X) == 0)
				dbg.push('\n');
			dbg.push(table[x]);
			dbg = dbg.concat(getBlanks(width - table[x].length));
			dbg.push('|');
		}
		console.log(dbg.join(''));
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
	function union(a1,a2){
		var one = a1;
		var other = a2;
		
		if(a1.area.length>a2.area){
			one = a2;
			other = a1;
		}
		
		for(var a in one.area){
			other.area[a]=one.area[a];
			other.length++;
		}
		return other;
	}
};
