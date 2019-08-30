
var myObstacles= []
var myGameArea= {
    canvas: document.createElement("canvas"),
    frames: 0,
    start: function(){
        this.canvas.width= 480;
        this.canvas.height= 270;
        this.context= this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval= setInterval(updateGameArea, 20);
    },
    clear: function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    },
    stop: function(){
        clearInterval(this.interval)
    },
    score: function(){
        var points= Math.floor(this.frames/10)
        this.context.font= "18px serif"
        this.context.fillStyle= "blue"
        this.context.fillText("Score: "+ points, 350, 50)
    }
}

class component {
    constructor(width, height, color, x, y){
        this.width= width;
        this.height= height;
        this.color= color;
        this.x= x;
        this.y= y
        this.speedX= 0
        this.speedY= 0
    }

    update(){
        var ctx= myGameArea.context;
        ctx.fillStyle= this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    newPos(){
        this.x += this.speedX
        this.y += this.speedY
    }

    left(){
        return this.x
    }
    right(){
        return this.x + this.width
    }
    top(){
        return this.y
    }
    bottom(){
        return this.y + this.height
    }

    crashWith(obstacle){
        return !(
            this.bottom()<obstacle.top() ||
            this.top()> obstacle.bottom() ||
            this.right() < obstacle.left() ||
            this.left() > obstacle.right()
        )
    }


}

var player = new component(30, 30, "red", 0, 110)

function updateGameArea(){
    myGameArea.clear()
    player.newPos()
    player.update()
    updateObstacles()
    checkGameOver()
    myGameArea.score()
}

myGameArea.start()

document.onkeydown = function(e){
    switch(e.keyCode){
        case 38:player.speedY-=1; break;
        case 40: player.speedY+=1; break;
        case 37: player.speedX -= 1; break;
        case 39: player.speedX +=1; break;
    }
}

document.onkeyup = function(e){
    player.speedX= 0;
    player.speedY= 0;
}

function updateObstacles(){
    myGameArea.frames+= 1;
    if(myGameArea.frames%120 ===0){
        var x= myGameArea.canvas.width;
        var minHeigth = 20;
        var maxHeight = 200;
        var height = Math.floor(Math.random()*(maxHeight-minHeigth +1) + minHeigth);
        var minGap = 50;
        var maxGap= 200;
        var gap = Math.floor(Math.random()*(maxGap- minGap +1)+ minGap)
        myObstacles.push(new component(10, height, "green", x, 0))
        myObstacles.push(new component(10, x - height - gap, "green", x, height+ gap));
    }

        for(let i=0; i<myObstacles.length; i++){
            myObstacles[i].x -=1;
            myObstacles[i].update()
        }

}

function checkGameOver(){
    var crashed = myObstacles.some(function(obstacle){
        return player.crashWith(obstacle)
    })

    if(crashed){
        myGameArea.stop()
    }
}