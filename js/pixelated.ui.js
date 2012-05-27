    var pix = new Pixelated();
$(function(){
    
    var $color = $('<div class="pix">');
    var $optionColor = $('<div class="option" style="height:30px;width:45px;display:block;position:absolute;top:220;cursor:pointer">');
    $('body').append($('<div style="position:absolute;top:300"><span>Restan </span><span id="left">'+pix.getLeftMoves()+'</span></div>'));
    
    
    drawTable( pix.getTable() );
    drawColors( pix.getColors() );
    
    pix.on('Win',function(){
        alert('Win');
    });
    pix.on('GameOver',function(){
        alert('GameOver');
    });
    pix.on('LeftUpdate',function(val){
       $('#left').text(val);
    });
    pix.on('TableChange',function(val){
        tableChange(val);
    });
    
    function drawTable( table ){
        var clonned;
        var options = $();
        for (var x=0; x< table.length; x++){
                clonned = $color.clone();
                clonned.css('left',(x%pix.getWidth())*20 + 'px');
                clonned.css('top', Math.floor(x/pix.getWidth())*20 + 'px');
                clonned.css('background-color', table[x]);
                clonned.attr('id','px-'+x);
                options = options.add(clonned);
        }
        $('body').append(options);
        
    }
    function drawColors(colors){
        var clonend;
        var options = $();
        for(var i=0; i<colors.length;i++){
            clonned = $optionColor.clone();
            clonned.css('left',i*60 + 'px');
            clonned.css('background-color', colors[i]);
            clonned[0].color=colors[i];
            options = options.add(clonned);
        }
        $('body').append(options);
    }
    
    $('.option').click(function(){
        pix.paintTo(this.color);
    })
    function tableChange(changes){
        var elems = $();
        for (var i in changes.area){
                var elem = $('#px-'+i);
                elems = elems.add(elem);
                elem[0].color=changes.color;
        }
        elems.css('background-color', changes.color);
    }
});
