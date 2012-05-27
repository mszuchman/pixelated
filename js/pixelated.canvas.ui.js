(function(){
    var pixelsSize = 20;
    
    var pix = new Pixelated();
    
    var canvas = document.createElement('canvas');
    
    var W = pix.getWidth();
    var H = pix.getHeight();
    canvas.width = pixelsSize * (W+1)+50;
    canvas.height = pixelsSize * (H+1) + 50;
    
    
    var ctx = canvas.getContext("2d");  
     
    document.getElementById('left').innerHTML = pix.getLeftMoves();
    
    
    drawTable( pix.getTable() );
    drawColors( pix.getColors() );
    
    document.body.appendChild(canvas);
    
    pix.on('Win',function(){
        alert('Win');
    });
    pix.on('GameOver',function(){
        alert('GameOver');
    });
    pix.on('LeftUpdate',function(val){
       document.getElementById('left').innerHTML = val;
    });
    pix.on('TableChange',function(val){
        tableChange(val);
    });
    
    function drawTable( table ){
        var clonned;
        for (var x=0; x< table.length; x++){
                ctx.fillStyle = table[x];  
                ctx.fillRect (15+(x%pix.getWidth())*pixelsSize, 15+Math.floor(x/pix.getWidth())*pixelsSize, pixelsSize, pixelsSize);
        }
        
    }
    function drawColors(colors){
        for(var i=0; i<colors.length;i++){
            ctx.fillStyle = colors[i];
            ctx.fillRect(i*60, pixelsSize * (H+1), 45,30);
        }
    }
    
    canvas.addEventListener('click',function(e){
        if(e.offsetY> (pixelsSize * (H+1)) && e.offsetY< (pixelsSize * (H+1) + 30)){
            if(e.offsetX>60 && e.offsetX< 60*45*pix.getColors().length);
                pix.paintTo(pix.getColors()[Math.ceil(e.offsetX / 60)-1]);
        }
    });
    function tableChange(changes){
        for (var i in changes.area){
                ctx.fillStyle = changes.color;
                ctx.fillRect (15+(i%W)*pixelsSize, 15+Math.floor(i/W)*pixelsSize, pixelsSize, pixelsSize);
        }
    }
})();
