var posY = [];
var posX = [];
var lastCell = {x:-1,y:-1}
var hashMap = new Map();
var matrix = [];
var penDown = false;
var rowSize = 10;
var canvas = document.getElementById('container');
var ctx = canvas.getContext('2d');
var rainbow = false;
var reverse = false;
var alpha = 1;
var speed = .1;
var hue = 0;
var rgb = [0,0,0, 255];
var quiltSel = 0;
var undos = [];
var canvasPic;

var rows = 1
var cols = 1

var rowSize
var colSize

matrix = []

var print = (x) =>{console.log(x)};

window.addEventListener("resize", redraw);
// redraw();

function redraw() {

    var min = (x,y) =>{ return (x > y ? y : x)};
    
    canvas.height = Math.floor(min(.9 * window.innerHeight, .5 * window.innerWidth - 60) / rows) * rows;
    canvas.width = Math.floor(canvas.height / cols) * cols;
    
    rowSize = Math.floor(canvas.height / rows);
    colSize = Math.floor(canvas.width / cols);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 255)'
    ctx.fillRect(0,0,canvas.width,canvas.width)
    
    matrix = []
    
    for(r = 0; r < rows; r++){
        curr = []
        for(c = 0; c < cols; c++)
            curr.push('0xffffff')
        matrix.push(curr)
    }
    
    $('#container').css("height",canvas.height);
    $('#container').css("width", canvas.width);
    $('.canvwrap').css("width", window.innerWidth * .5);
    makeGrid();
    showTable()
}

function showTable(){
    outString = ""
    for(r = 0; r < rows; r++){
        if (reverse && (r & 1))
            for(c = cols - 1; c >= 0; c--)
                outString += matrix[r][c] + ','
        else
            for(c = 0; c < cols; c++)
                outString += matrix[r][c] + ','
    }
    
    $("#table").val(outString)
}


function decimalToHex(d) {
    var hex = Number(d).toString(16);
    padding = 2

    while (hex.length < padding) {
        hex = "0" + hex;
    }

    return hex;
}

$('#reverse').change(function (){
    reverse =! reverse
    showTable()
});

$('#rows').change(function (){
	if ($('#rows').val() <= 0)
		$('#rows').val(1);
	rows = parseInt($('#rows').val());
    redraw()
});

$('#cols').change(function (){
	if ($('#cols').val() <= 0)
		$('#cols').val(1);
	cols = parseInt($('#cols').val());
    redraw()
});


$('#gridBtn').click(function (){
	$("#grid").toggle();
});


$("#reset").click(function(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(r = 0; r < rows; r++){
        curr = []
        for(c = 0; c < cols; c++)
            curr.push('0xffffff')
        matrix.push(curr)
    }
});


$('#container').mousedown(function(){
    draw()
    penDown = true
});

$('#container').mouseup(function(){
    penDown = false
});
$('#container').mouseout(function(){
    penDown = false
});
$('#container').mousemove(function(){
    if (penDown)
        draw()
});

function draw(){
    pos = getMousePos();
    
    let x = Math.floor(pos.x / colSize)
    let y = Math.floor(pos.y / rowSize)
    
    ctx.fillStyle = rgbPick
    ctx.fillRect(x  * colSize, y  * rowSize, colSize, rowSize)
    
    matrix[y][x] = '0x' + decimalToHex(rgb[0]) + decimalToHex(rgb[1]) + decimalToHex(rgb[2])
    showTable()
}



function getMousePos() {
    let rect = $("#container")[0].getBoundingClientRect();
    return {
      x: Math.floor(event.clientX - rect.left),
      y: Math.floor(event.clientY - rect.top)
    };
}

$("#readTable").click(function(){
    
    hashMap.clear();
    matrix = [];
    let lines = $("#truthTable").val().split('\n').filter(d => d);
    
});

function makeGrid(){
    $("#grid").empty();
    let rect = $("#container")[0].getBoundingClientRect();
    
    for(i = 1; i < rows; i++){
        $("#grid").prepend('<div class="line"></div>');
        $(".line:first").css({
            width: canvas.width,
            height: 2,
            top: rect.top + rowSize * i ,
            left: rect.left + 1,
        });
    }
    
    for(i = 1; i < cols; i++){
        $("#grid").prepend('<div class="line"></div>');
        $(".line:first").css({
            width: 2,
            height: canvas.height,
            top: rect.top + 1,
            left: rect.left + colSize * i ,
        })
    }
}

redraw()
