var monster_colors = "10002b-240046-3c096c-5a189a-7b2cbf-9d4edd-c77dff-e0aaff".split("-").map(a=>"#"+a)
class Monster{
    constructor(args){ 
        this.r = args.r || random(50,70)
        this.p = args.p || createVector(random(width),random(height))
        this.v = args.v || createVector(random(-1,1),random(-1,1))
        this.color = args.color ||random(monster_colors)
        this.mode = random(["happy","bad"])
        this.Isdead = false //false代表該怪物還活著
}

draw(){
    if(this.Isdead==false){//活著時        
    
    push()
    translate(this.p.x,this.p.y)
        fill(this.color)
        noStroke()
        ellipse(0,0,this.r)
        if(this.mode == "happy"){
            fill(255)
            ellipse(0,0,this.r/2)
            fill(0)
            ellipse(0,0,this.r/3)    
        }else{
            fill(255)
            arc(0,0,this.r/2,this.r/2,0,PI)
            fill(0)
            arc(0,0,this.r/3,this.r/3,0,PI)
        }
        stroke(this.color)
        strokeWeight(4)
        //line(this.r/2,0,this.r,0)
        noFill();
        for(var j=0;j<8;j++){
        rotate(PI/4)
        beginShape()
        for (var i=0;i<(this.r/2);i++){
            vertex(this.r/2+i,sin(i/5+frameCount/10)*10)
        }
        endShape()
    }
    pop()
}else{  //死後爆炸的畫面
    push()
    translate(this.p.x,this.p.y)
    fill(this.color)
    noStroke()
    ellipse(0,0,this.r)
    stroke(255)
    line(-this.r/3,0,this.r/3,0)//眼睛的線
    //產生腳
    stroke(this.color)
    strokeWeight(4)
    noFill();
    for(var j=0;j<8;j++){
        rotate(PI/4)
        line(this.r/2,0,this.r,0)
    }
    
    pop()

}
}

update(){
    this.p.add(this.v)
    //碰壁的處理程式碼
    if(this.p.x<0 || this.p.x>=width)
    {
     this.v.x = -this.v.x
    }
    if(this.p.y<=0 || this.p.y>=width)
  {
     this.v.y = -this.v.y
  }

}
isBallInRanger(x,y){ //判斷有沒有被滑鼠按到
    let d = dist(x,y,this.p.x,this.p.y)//計算滑鼠按下的點與此物件位置之間的距離
    if(d<this.r/2){ //飛彈與怪物間的距離如小於半徑(this.r/2)，代表碰撞到
      return true //代表距離有在範圍內
    }else{
      return false//代表距離沒有在範圍內
    }
   }
}