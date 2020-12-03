
//...............................................................................................................
let mario;
let myObstacle;
let monster;
let pipe;
let hittunnel = [];
let mariodead = false;
let monsterdead = false;
let imgcount = 0;
let m = [];
let c = [];
let mcount = -1;
let ccount = -1;
let blocknumber;
let crashflag = false;
let time = 120;
let timeCnt = 1;
// let imgArray = new Array();
// imgArray[0] = new Image();
// imgArray[0].src = 'image/right.png';

// imgArray[1] = new Image();
// imgArray[1].src = 'image/right1.png';
function startGame() {
    myGameArea.start();
    let scloud = jsonFiles[0][0];
    let block = jsonFiles[0][2].position;
    blocknumber = jsonFiles[0][2].position.x.length;
    bkg = new component(480, 270, "#1E90FF", 0, 0);
    bkg1 = new component(250, 30, "./image/background.png", 140, 210, "image");
    bkg2 = new component(80, 40, "./image/mountain.png", 0, 200, "image");
    base = new component(480, 30, "./image/base.png", 0, 240, "image");

    smallcloud = new component(scloud.width, scloud.height, "./image/smallcloud.png", scloud.position.x[0], scloud.position.y[0], "image");
    largecloud = new component(80, 40, "./image/largecloud.png", 350, 80, "image");
    mario = new component(20, 20, "./image/right.png", 30, 220, "image");
    bigblock = new component(100, 21, "./image/bigblock.png", 240, 180, "image");
    for(let i = 0; i < blocknumber; i++){
        window['block'+i] = new component(20, 20, "./image/block.png", block.x[i], block.y[i], "image");      
    }
    pipe = new component(40, 40, "./image/pipe.png", 420, 200, "image");
    monster = new component(20, 20, "./image/monster.png", 400, 240, "image");
}



let myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = true;
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = false;       
        })
    }, 
    stop : function() {
        clearInterval(this.interval);
    }, 
    clear : function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    removeMonster : function(x, y, width, height){
        this.context.clearRect(x, y, width, height);
    },
}

function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image") {
        this.image = new Image();
        this.image.src = color;
    }
    this.score = 0;
    this.coins = 0;
    this.time = 120;
    this.gamearea = myGameArea;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;    
    this.gravity = 0.05;
    this.gravitySpeed = 0;
    this.update = function() {
        ctx = myGameArea.context;
        if (type == "image") {
            ctx.drawImage(this.image, 
                this.x, 
                this.y,
                this.width, this.height);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function(crash =0, obstacle) {
        if(crash == 1){
            this.gravitySpeed += this.gravity;
            this.x += this.speedX;
            this.y += this.speedY + this.gravitySpeed;
            this.hitBottom(crash, obstacle);
        }
        else if(crash == 2){
            this.gravitySpeed += this.gravity;
            this.x += this.speedX;
            this.y += this.gravitySpeed;
            this.hitBottom(crash, obstacle);

        }
        else if(crash == 3){
            this.gravitySpeed += this.gravity;
            if(this.speedX == -1){
                this.x += this.speedX;
            }
            else{
                this.x = obstacle.x - this.width;
            }
            this.y += this.gravity +1;
            this.hitBottom(crash, obstacle);

        }
        else if(crash == 4){
            this.gravitySpeed += this.gravity;
            if(this.speedX == 1){
                this.x += this.speedX;
            }
            else{
                this.x = obstacle.x + obstacle.width;
            }
            this.y += this.gravity +1;
            this.hitBottom(crash, obstacle);

        }
        else{
            this.gravitySpeed += this.gravity;
            this.x += this.speedX;
            this.y += this.speedY + this.gravitySpeed;
            this.hitBottom(crash, obstacle);
        }
    }
    this.hitBottom = function(crash = 0, obstacle) {
        if(crash == 1){
            let rockbottom = obstacle.y - this.height;
            if (this.y > rockbottom) {
                this.y = rockbottom;
                this.gravitySpeed = 0;
            }
        }
        else{
            let rockbottom = myGameArea.canvas.height - this.height - base.height;
            if (this.y > rockbottom) {
                this.y = rockbottom;
                this.gravitySpeed = 0;
            }
        }
        
    }
    this.crashWith = function(otherobj) {
        let myleft = this.x;
        let myright = this.x + (this.width);
        let mytop = this.y;
        let mybottom = this.y + (this.height);
        let otherleft = otherobj.x;
        let otherright = otherobj.x + (otherobj.width);
        let othertop = otherobj.y;
        let otherbottom = otherobj.y + (otherobj.height);
        let crash = 0;
        if((mybottom <= othertop) && (myright >= otherleft) && (myleft <= otherright)){
            
            crash = 1;
        }
        else if((mytop < otherbottom) && (mybottom > othertop) && (myright == otherleft) && (myleft < otherleft)){
            crash = 3;
        }
        else if((mytop < otherbottom) && (mybottom > othertop) && (myleft == otherright) && (myright > otherright)){
            crash = 4;
        }
        else if((mytop <= otherbottom) && (myright >= otherleft) && (myleft <= otherright)){
            crash = 2;
                if(otherobj != bigblock){
                    if(!otherobj.image.src.match("image/emptyblock.png")){
                    otherobj.image.src = "image/emptyblock.png";
                    this.createGifts(otherobj);
                    }
                }
        }
        else{
            crash = 0;
        }
    return crash;  
    },
    this.killMonster = function(monster){
        let mybottom = this.y + (this.height);
        let monstertop = monster.y;
        let myleft = this.x;
        let myright = this.x + (this.width);
        let monsterleft = monster.x;
        let monsterright = monster.x + (monster.width);
        if((mybottom >= monstertop) && (mybottom <= monstertop+5) && (myright >= monsterleft) && (myleft <= monsterright)){
            return true;
        }
        else{
            return false;
        }
    }
    this.killPlayer = function(mario){
        let monsterleft = this.x;
        let monsterright = this.x + (this.width);
        let myleft = mario.x;
        let myright = mario.x + (mario.width);
        let mybottom = mario.y + (mario.height);
        let monsterbottom = this.y + this.height;
        if(((myright == monsterleft) || (myleft == monsterright)) && (mybottom >= monsterbottom)){
            return true;
        }
        else{
            return false;
        }
    }
    this.createGifts = function(block){
        let rand = Math.round(Math.random());
        if(rand == 1 ){
            mcount++;
            window['m'+mcount] = new component(30, 20, "./image/mushroom.png", block.x, block.y-20, "image");
        }
        else if(rand == 0){
            ccount++;
            window['c'+ccount] = new component(20, 20, "./image/coin.png", block.x, block.y-20, "image");
   }
        
    }
    this.absorbGifts = function(gift,type){
            let myright = this.x + (this.width);
            let myleft = this.x;
            let mytop = this.y;
            let mybottom = this.y + (this.height);
            let gifttop = gift.y;
            let giftbottom = gift.y + gift.height;
            let giftleft = gift.x;
            let giftright = gift.x + gift.width;
        
            if((mybottom < gifttop) || (mytop > giftbottom) || (myright < giftleft) || (myleft > giftright)){
            }
            else{
                gift.width = 0;
                gift.height = 0;
                gift.x = 0;
                gift.y = 0;
                if(type === "m")
                {
                    this.updateScore(20);
                }
                else
                {
                    this.updateScore(10);
                    this.updateCoin(1);
                }
            }

    }
    this.marioWins = function(){
        myGameArea.stop();
    }
    this.newMonster = function(){
        monster.x = 400;
        monster.width = 20;
        monster.height = 20;

    }
    this.updateScore = function(score){
        this.score += score;
    }
    this.updateCoin = function(coins){
        this.coins += coins;
    }
}

function updateGameArea() {

    myGameArea.clear();
    refresh();
    myGameArea.context.font = "10px serif";
    myGameArea.context.fillStyle = "#ffffff";

    myGameArea.context.fillText("score",20,20);
    myGameArea.context.fillText("coins",220,20);
    myGameArea.context.fillText("time",420,20);

    myGameArea.context.fillText(mario.score,27,40);
    myGameArea.context.fillText(mario.coins,227,40);
    if(timeCnt % 50 === 0)
    {
        if(time === 0)
        {
            time = 0;
            myGameArea.stop();
        }
        else
        {
            time -= 1;
        }
        timeCnt = 1;
    }
    else
    {
        timeCnt += 1;
    }
    myGameArea.context.fillText(time,427,40);

    // //.................................CODE FOR MARIO MOVEMENT..........................................

    mario.speedX = 0;
    mario.speedY = 0;

    if (myGameArea.keys && myGameArea.keys[37]) {
        mario.image.src = "image/left.png";
        mario.speedX = -1;
    }
    if (myGameArea.keys && myGameArea.keys[39]) {
        mario.image.src = "image/right.png";
        mario.speedX = 1; 
    }
    if (myGameArea.keys && myGameArea.keys[38]) {
        mario.speedY = -2.8;
    }


    // // ........................CODE FOR MARIO OR MONSTER DEAD.........................................  

    if(!monsterdead){
        monsterdead = mario.killMonster(monster);
    }
    if(!mariodead){
        mariodead = monster.killPlayer(mario);
    }

    if(monsterdead){
        monster.width = 0;
        monster.height = 0;
        monster.x = 500;
        mario.updateScore(15);
    }
    else if(mariodead){
        mario.image.src = "image/dead.png";
        mario.gravitySpeed += mario.gravity;
        mario.y -= 1.4 ;
        mario.y += mario.gravitySpeed;
        refresh();
        myGameArea.context.font = "10px serif";
        myGameArea.context.fillStyle = "#ffffff";

        myGameArea.context.fillText("score",20,20);
        myGameArea.context.fillText("coins",220,20);
        myGameArea.context.fillText("time",420,20);

        myGameArea.context.fillText(mario.score,27,40);
        myGameArea.context.fillText(mario.coins,227,40);
        time = 0;
        myGameArea.context.fillText(time,427,40);
        myGameArea.stop();
        setTimeout(myGameArea.stop, 3000);
        return;
    }   

    // ................................CODE FOR GIFT MOVEMENT AND ABSORPTION.................................................... 
    for(let i = 0; i<= mcount; i++){
        mario.absorbGifts(window['m'+i],"m");
    }
    for(let i = 0; i<= ccount; i++){
        mario.absorbGifts(window['c'+i],"c");
    }
    for(let i = 0; i<= mcount; i++){ 
        if(((window['m'+i].x + window['m'+i].width) == pipe.x) || hittunnel[i] == 1){
            window['m'+i].x-=2;
            hittunnel[i] = 1;
        }
        window['m'+i].x+=1;
        window['m'+i].update();
        if(window['m'+i].crashWith(window['block'+i]) == 1){
            window['m'+i].newPos(window['m'+i].crashWith(window['block'+i]), window['block'+i]);
        }
        else if(window['m'+i].crashWith(bigblock) == 1){
            window['m'+i].newPos(window['m'+i].crashWith(bigblock), bigblock);
        }
        else if(window['m'+i].crashWith(window['block'+i]) == 0){
            window['m'+i].newPos(window['m'+i].crashWith(window['block'+i]), window['block'+i]);
        }
    }


    // //.................................CODE FOR CRASH WITH OBSTACLES............................................
    
    for(let i=0; i< blocknumber; i++){
        if(mario.crashWith(window['block'+i]) != 0){
            crashflag = true;
            mario.newPos(mario.crashWith(window['block'+i]), window['block'+i]);
        }
        if(crashflag == true){
            break;
        }
    }
    if(crashflag == false){
        if(mario.crashWith(bigblock) != 0){
            mario.newPos(mario.crashWith(bigblock), bigblock);
        } 
        else if(mario.crashWith(pipe) != 0){
            mario.newPos(mario.crashWith(pipe), pipe);
        }   
        else{
            mario.newPos();
        }
    }
    else{
        crashflag = false;
    }
    
    if(mario.crashWith(pipe) == 1){
        setTimeout(mario.marioWins, 1000);
    }

    monster.x-=0.5;
    // //......................................CREATING NEW MONSTER........................................

    if(monsterdead || monster.x < 0){
       monsterdead = false;
       setTimeout(monster.newMonster, 1000);
    }
}
    // //......................................UPDATING GAME AREA........................................

   

    
function refresh(obj){
    monster.newPos();
    bkg.update();
    bkg1.update();
    bkg2.update();
    base.update();
    smallcloud.update();
    largecloud.update();
    mario.update();
    bigblock.update();
    for(let i = 0; i < blocknumber; i++){
        window['block'+i].update();        
    }
    for(let i = 0; i <= mcount; i++){
        window['m'+i].update();        
    }
    for(let i = 0; i <= ccount; i++){
        window['c'+i].update();        
    }
    pipe.update();
    monster.update();

}

//..........................................Getting Objects From JSON............................................
let jsonStringFiles = "";
let jsonFiles = [];

function loadDoc() {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        jsonStringFiles = this.responseText.split(" * ");
        parseJSONString(jsonStringFiles);

        };
    };
    xhttp.open("GET", "http://localhost:3000", true);
    xhttp.send();
  }
  
  function parseJSONString(jsonStringFiles) {
    for (let i = 0; i < jsonStringFiles.length; i++) {
      jsonFiles.push(JSON.parse(jsonStringFiles[i]));
    }
  }
  loadDoc();
  setTimeout(startGame, 1000);