// let points = [[-7, -5], [-9, -6], [-11, -6],[-12,-5],[-13,-5],[-14,-4],[-15,-2],[-14,1],[-13,3],[-12,5],[-9,6],[-8,10],[-7,12],[-6,15],[-4,17],[-3,17],[-2,16],[-3,15],[-8,5]] 
//  [[-8, 5], [-2, 14], [-1, 15],[1,15],[1,13],[-2,9],[-4,7],[-7,5],[-5,5],[-4,4],[-4,2],[-4,4],[-2,6],[1,7],[3,7],[6,6],[7,6],[8,5],[10,2],[11,-1],[12,-5],[12,-2],[12,-11],[14,-10],[16,-12],[16,-15],[10,-17],[5, -17],[0, -17], [-2, -17],[-3,-16],[-3,-15],[-2,14],[1,-14],[1,-13],[0,-11],[-1,-9],[0,-6],[2,-3],[5,-2]] 
//  [[-2,-14],[-3,-14],[-3,-12],[-3,-14],[-4,-15],[-5,-17],[-8,-17],[-9,-16],[-9,-14],[-8,-14],[-7,-14],[-6,-13],[-6,-10],[-5,-9],[-6, -10], [-6, -12], [-8, -10],[-9,-9],[-10,-7],[-10,-6]] 
//  [[-11,2],[-10,3],[-9,2],[-10,1],[-11,2]] 
//  [[-8,-10],[-8,-13],[-10,-13],[-11,-15],[-10,-17],[-8,-17]];
 
 let points =  [[1, 8], [3, 9], [4, 9],[5,8],[5,6],[4,7],[3,7],[1,5],[2,4],[2,-1],[3,-3],[3,-5],[4,-5],[5,-4],[6,-4],[7,-5],[5,-7],[4,-7],[3,-6],[3,-7],[-5,-7],[-5,-6],[-4,-5],[-3,-5],[-4,-4],[-4,-3],[-3,-2] , [-2, -2], [-3, 0], [-3, 1],[-4,2],[-5,1],[-6,2],[-4,4],[-4,3],[-5,3],[-6,4],[-5,5],[-4,5],[-3,4],[-2,5],[-3,6],[-3,7],  [-1, 10], [1, 10], [3, 11],[4,11],[6,10],[4,9],[3,9]]; //list資料
 var stroke_colors = "ffb5a7-fcd5ce-f8edeb-f9dcc4-fec89a".split("-").map(a=>"#"+a)
 var fill_colors = "ffe5ec-ffc2d1-ffb3c6-ff8fab-fb6f92".split("-").map(a=>"#"+a)
 
 function preload(){
  rabbit_sound = loadSound("sound/rabbit.wav")
  bullet_sound = loadSound("sound/gun.wav")
  }

 //粒子，類別
 class Obj{
   constructor(args){  //預設值，基本資料(包含有物件的顏色、位置、速度、大小...)
   // this.p = {x: random(width),y:random(height)} //一個物件開始的位置
   this.p = args.p ||createVector(random(width),random(height)) 
     // this.v = {x: random(-1,1),y:random(-1,1)} //速度，x,y移動的速度為亂數產生-1,1之間的
     this.v = createVector(random(-1,1),random(-1,1)) //產生一個座標值為(-1,1)
     this.size = random(6,10) //放大倍率
     this.color = random(fill_colors)
     this.stroke = random(stroke_colors)
   }
   draw()  //把物件畫出來的函數
   {
    push() //重新設定，設定新的原點與顏色設定
     translate(this.p.x,this.p.y) //原點設定在==>物件所在位置
     scale((this.v.x<0?1:-1),-1) //放大縮小的指令,左右翻轉==>this.v.x<0?1:-1 ==>this.v.x<0條件成立的話，則值為1，否則為-1
     fill(this.color)
     stroke(this.stroke)
     strokeWeight(5)
     beginShape()
     for(var i =0;i<points.length-1;i=i+1){
       //line(points[i][0]*this.size,points[i][1]*this.size,points[i+1][0]*this.size,points[i+1][1]*this.size)
       curveVertex(points[i][0]*this.size,points[i][1]*this.size)
 
     }
     endShape()
     pop()
  
    }
    update(){ //移動後設定位置資料值為何
     //this.p.x = this.p.x + this.v.x
     //this.p.y = this.p.y + this.v.y
     this.p.add(this.v)//此行的效果和上面兩行一樣,add為加
     //算出滑鼠位置的向量
     //隨著滑鼠方向移動，每隻大象移動速度都一樣(.limit.3)
     //let mouseV = createVector(mouseX,mouseY)
     //let delta = mouseV.sub(this.p).limit(3) //delta值紀錄與滑鼠方向移動的"單位"距離，sub為向量減法
    //  let delta = mouseV.sub(this.p).limit(this.v.mag()*2) //與原本物件的速度有關，this.mag()==>取得物件的速度值
    //  this.p.add(delta)
     //碰壁的處理程式碼
     if(this.p.x<0 || this.p.x>width)
     {
      this.v.x = -this.v.x
     }
     if(this.p.y<0 || this.p.y>width)
   {
      this.v.y = -this.v.y
   }
 }
 isBallInRanger(x,y){ //判斷有沒有被滑鼠按到
  let d = dist(x,y,this.p.x,this.p.y)//計算滑鼠按下的點與此物件位置之間的距離
  if(d<this.size*4){ //4的由來:去看座標點最大的值，以此作為方框的高與寬
    return true //代表距離有在範圍內
  }else{
    return false//代表距離沒有在範圍內
  }
 }
 }
 
 var ball //代表單一個物件，利用這個變數來做正在處理的物件
 var balls =[] //陣列，放所有的物件資料，倉庫，裡面儲存所有的物件資料
 var bullet
 var bullets=[]
 var monster
 var monsters = []
 var score = 0
 var shipP
 function setup(){ //設定大象物件倉庫內的資料
   createCanvas(windowWidth,windowHeight);
   shipP = createVector(width/2,height/2)//預設砲台的位置為視窗的中間(使用向量的方式)
   //產生幾個物件
   for(var j=0;j<10;j=j+1)
   {
     ball = new Obj({}) //產生一個新的物件，暫時放到ball變數中
     balls.push(ball) //把ball物件放到balls物件群(陣列)中
   }
 
   for(var j=0;j<20;j=j+1)
   {
     monster = new Monster({}) //產生一個新的物件，暫時放到ball變數中
     monsters.push(monster) //把ball物件放到balls物件群(陣列)中
   }
 }
 
 function draw() {//每秒會執行60次
   background(220);
  // for(k=0;k<balls.length;k=k+1){
    // ball = balls[k]
     //ball.draw()
    // ball.update()
   //}
  if(keyIsPressed){
  
   if(key=="ArrowLeft"|| key=="a"){ //按下鍵盤的往左鍵
    shipP.x = shipP.x-5
   }
   if(key=="ArrowRight"|| key=="d"){ //按下鍵盤的往左鍵
    shipP.x = shipP.x+5
   }
   if(key=="ArrowUp"|| key=="w"){ //按下鍵盤的往左鍵
    shipP.y = shipP.y-5
   }
   if(key=="ArrowDown"|| key=="s"){ //按下鍵盤的往左鍵
    shipP.y = shipP.y+5
   }
 }
 
 
 
  for(let ball of balls){ //針對陣列變數，取出陣列內一個一個物件
    ball.draw()
    ball.update()
    //由此判斷，每隻大象有沒有接觸每一個飛彈
    for(let bullet of bullets){
      if(ball.isBallInRanger(bullet.p.x,bullet.p.y)) //判斷ball與bullet有沒有碰觸
      {
        score = score - 2
        rabbit_sound.play()
        balls.splice(balls.indexOf(ball),1) //讓大象從大象倉庫內移除
        bullets.splice(bullets.indexOf(bullet),1) //讓飛彈從飛彈倉庫內移除
      }
    }
  }
 
   for(let bullet of bullets){ //針對飛彈倉內的資料，一筆一筆的顯示出來
     bullet.draw()
     bullet.update()
   }
 
   for(let monster of monsters){ //針對怪物倉內的資料，一筆一筆的顯示出來
     monster.draw()
     monster.update()
   
 
    for(let bullet of bullets){
     if(monster.isBallInRanger(bullet.p.x,bullet.p.y)) //判斷ball與bullet有沒有碰觸
     {
       score = score + 5
       //elephant_sound.play()
       //monsters.splice(monsters.indexOf(monster),1) //讓大象從大象倉庫內移除
       monster.Isdead = true //已經被打到了，準備執行爆炸後的畫面
       bullets.splice(bullets.indexOf(bullet),1) //讓飛彈從飛彈倉庫內移除
      }
    }
  }
  
  
 
 
  textSize(50)
  text(score,50,50)
  //劃出中間三角形的砲台
   push()
   let dx = mouseX-width/2 //滑鼠座標到中心點座標的x軸距離
   let dy = mouseY-height/2//滑鼠座標到中心點座標的y軸距離
   let angle = atan2(dy,dx)//利用反tan算出角度
 
   //translate(width/2,height/2) //為砲台的位置
   translate(shipP.x,shipP.y) //為砲台的位置，使用shipP的向量值
   rotate(angle) //讓三角形翻轉一個angle角度
   noStroke()
   fill("#ffd6ff")
   ellipse(0,0,60)//劃出中間的圓
   fill("#ff8fab")
   triangle(50,0,-25,-25,-25,25)//劃出三角形
   pop()
   
 }
 function mousePressed(){
  //按下滑鼠產生一個物件程式碼
  // ball = new Obj({
  //    p:{x:mouseX,y:mouseY}
  //  }) // 產生一個新的物件，"暫時"放入到ball變數中
  //  balls.push(ball)
  
  //按下滑鼠後刪除大象物件
  //  for (let ball of balls){
  //   if(ball.isBallInRanger(mouseX,mouseY)){
  //     //把倉庫的這個物件刪除
  //     score = score+1
  //     balls.splice(balls.indexOf(ball),1)//把倉庫內第幾個刪除，只刪除一個(indexOf()找出ball的編號)
  //   }
  //  }
 
  //新增一筆飛彈資料(還沒有顯示)
  bullet = new Bullet({
    //r:random(10,30),
    // color:random(fill_colors)
  })
  bullets.push(bullet) //把這一筆資料放入飛彈倉庫
  bullet_sound.play()
 }
 
 function keyPressed(){
  if(key==" "){ 
  bullet = new Bullet({})
  bullets.push(bullet) //把這一筆資料放入飛彈倉庫
  bullet_sound.play()
 
 
 }
 }
 