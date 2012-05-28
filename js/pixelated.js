var Pixelated = function( conf ) {
	
	var X = conf && conf.width || 16;
	var Y = conf && conf.height || 9;
	var colors = conf && conf.colors || ['red','green','blue','yellow','violet','orange'];
	var leftQty = conf && conf.maxTries || 29;
	var buildTable = conf && conf.buildStrategy || randomTable;
	var table = buildTable();
	var events = [];
	var lastColor = table[0];
	var endGame = false;
	
	var MOVES = {
		LEFT : { move: function(pos){ return pos-1 }, canMove:function(pos){ return pos%X>0 }},
		RIGHT : { move: function(pos){ return pos+1 }, canMove:function(pos){ return pos%X<X-1 }},
		UP : { move: function(pos){ return pos-X }, canMove:function(pos){ return Math.floor(pos/X)>0 }},
		DOWN : { move: function(pos){return pos+X },canMove:function(pos){return Math.floor(pos/X)<Y-1}}
	}
	
	function randomTable() {
		var table = [];
		var length = X*Y;
		for (var x=0; x< length; x++){
			table[x] = getAnyColorOf(colors);
		}
		return table;
	}
	function reBuildeableTable() {
		var table = [];
		var originalColor = getAnyColorOf(colors);
		var length = X*Y;
		for (var x=0; x< length; x++){
			table[x] = originalColor;
		}
		var colorsToPaint = getElementsWithout(colors,originalColor);
		for(var k=0; k<leftQty;k++){
			color = getAnyColorOf(colorsToPaint);
			
			var posToCut = Math.floor(Math.random() * length);
			var height = Math.floor(Math.random() * Math.floor((length - posToCut)/(X*2)) ) +1;
			var width = Math.floor(Math.random() * posToCut%(X/2))+1 ;
			for(var i=posToCut; i<posToCut+width;i++){
				for(var j=i; j< (i + height*X);j+=X){
					if(table[j] == originalColor)
						table[j] = color;
				}
			}
			
		}
		return table;
	}
	function getElementsWithout(arr, element){
		var newArray = [];
		for(var a in arr){
			if(arr[a]!=element)
				newArray.push(arr[a]);
		}
		return newArray;
	}
	function getAnyColorOf(colorsToPaint) {
		var idx = Math.floor(Math.random() * (colorsToPaint.length));
		return colorsToPaint[idx];
	}
	function hasSomething(pixelsToCheck, checkedPixels, pos,movement, color){
		while( movement.canMove(pos) ){
			pos = movement.move(pos);
			if( pixelsToCheck[pos]== color && checkedPixels[pos]==undefined )
				return true;
		}
		
		return false;
	}
	//Change all of this. For only check the portiontion of table that could change
	function checkNeighboards(pixelsToCheck, checkedPixels,pos,color){
		var paintedArea = {length:0,area:[]}; //Becasuse size of array count null / undefined positions
		if(pixelsToCheck[pos]!=color)
			return paintedArea;
		
		if(checkedPixels[pos])
			return paintedArea;
		checkedPixels[pos]=true;
		
		if( pos%X>0 && hasSomething(pixelsToCheck,checkedPixels,pos,MOVES.LEFT,color))
			paintedArea = union(paintedArea,(checkNeighboards(pixelsToCheck,checkedPixels,pos-1,color)));
		if( Math.floor(pos/X)>0 && hasSomething(pixelsToCheck,checkedPixels,pos,MOVES.UP,color))
			paintedArea = union(paintedArea,(checkNeighboards(pixelsToCheck,checkedPixels, pos-X,color)));
		if( Math.floor(pos/X)<Y-1 && hasSomething(pixelsToCheck,checkedPixels,pos,MOVES.DOWN,color))
			paintedArea = union(paintedArea,(checkNeighboards(pixelsToCheck,checkedPixels,pos+X,color)));
		if( pos%X<X-1 && hasSomething(pixelsToCheck,checkedPixels,pos,MOVES.RIGHT,color))
			paintedArea = union(paintedArea,(checkNeighboards(pixelsToCheck,checkedPixels,pos+1,color)));
		
		paintedArea.area[pos] = true;
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
	
	this.getHeight = function(){
		return Y;
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
		} else if(leftQty==0){
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
		if(console && console.log)
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
