const minimap = document.getElementById('minimap-container');
const map_mini = new Image();
map_mini.src = "images/minimap_small.png";
const player_mini = new Image();
player_mini.src = "images/minimap_player.png";
var flash = new Image();
var flashPosition = [];
var flashSequence = [
    new Image(),
    new Image(),
    new Image(),
    new Image(),
    new Image(),
    new Image(),
    new Image(),
    new Image(),
    new Image(),
    new Image(),
    new Image()
]
flashSequence[0].src = "images/minimap_flash/1.png";
flashSequence[1].src = "images/minimap_flash/2.png";
flashSequence[2].src = "images/minimap_flash/3.png";
flashSequence[3].src = "images/minimap_flash/4.png";
flashSequence[4].src = "images/minimap_flash/5.png";
flashSequence[5].src = "images/minimap_flash/6.png";
flashSequence[6].src = "images/minimap_flash/7.png";
flashSequence[7].src = "images/minimap_flash/8.png";
flashSequence[8].src = "images/minimap_flash/9.png";
flashSequence[9].src = "images/minimap_flash/10.png";
flashSequence[10].src = "images/minimap_flash/11.png";
var flashIndex = -1;
var isFlashing = false;

//draw flash
function drawFlash(flashPosArray) { 
    if(isFlashing == false) {
        flashIndex = -1;
        isFlashing = true;
        flashPosition = flashPosArray;
        var flashInterval = setInterval(function(e) {
            flashIndex++;
            flashIndex = flashIndex % flashSequence.length;
            flash = flashSequence[flashIndex];
            if(flashIndex == flashSequence.length - 1) {
                clearInterval(flashInterval);
                isFlashing = false;
            }
        }, 100);
    }
}

//update
function UpdateMinimap() {

    var width = $(minimap).width();
    var height = $(minimap).height();

    if (width > 0) {
        minimap.width = width;
        minimap.height = height;
        //
        var ctx = minimap.getContext("2d");
        ctx.clearRect(0, 0, width, height);
        //draw map
        ctx.drawImage(map_mini, 0, 0, width, height);

        //calculate player position
        var mapsize = 62.4;
        var playerPos3D = playerController.getPosition();
        var player_mini_x = (playerPos3D.x / mapsize + 1 / 2) * width;
        var player_mini_y = (playerPos3D.z / mapsize + 1 / 2) * height;

        //calculate player rotation
        var playerRotation = playerController.getRotation();

        //draw player
        ctx.translate(player_mini_x, player_mini_y);
        ctx.rotate(- playerRotation.y + Math.PI); //increment the angle and rotate the image 
        ctx.drawImage(player_mini, - width * 0.15, - height * 0.15, width * 0.3, height * 0.3);
        ctx.restore(); //restore the state of canvas
        ctx.resetTransform();
        //draw flash
        if(isFlashing) {
            for(var i = 0; i < flashPosition.length; i ++) {
                var flashPos3D = flashPosition[i];
                var flash_x = (flashPos3D.x / mapsize + 1 / 2) * width;
                var flash_y = (flashPos3D.z / mapsize + 1 / 2) * height;
    
                //draw player
                ctx.translate(flash_x, flash_y);
                ctx.drawImage(flash, - width * 0.15, - height * 0.15, width * 0.3, height * 0.3);
                ctx.restore(); //restore the state of canvas
                ctx.resetTransform();
            }
        }
        
    }
}
