window.addEventListener("load",function(){
    //setup of canvas
    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext("2d");
    //initial constants setup
    const height= 500;
    const realheight=15;
    const heighttowidth=5;
    const floorfromtop=realheight-2;
    const realwidth=realheight*heighttowidth;
    const meter_scale=height/realheight;
    const width = realwidth*meter_scale;
    canvas.width = width;
    canvas.height = height;
    
    //calculated values setup
    const initial_time_scale=1;
    const realdinosaurheight=3.6;
    const realbirdheight=2;
    const dinoheight=realdinosaurheight*meter_scale;
    const birdheight=realbirdheight*meter_scale;
    const floor=(floorfromtop-realdinosaurheight)*meter_scale;
    const gravity=9.8*meter_scale;
    const sneakgravityfactor=50;
    const realjumpingspeed=3.27*3;
    const jumpspeed=realjumpingspeed*meter_scale;
    const animationspeedpersecond=0.1;
    const realdinorunspeed=12.22;
    const dinorunspeed=realdinorunspeed*meter_scale
    const realfloorheightonimagefromtop=127;
    //enemy levels
    const lowlevel=(floorfromtop*meter_scale);
    const midlevel=0.5*height;
    const highlevel=0.2*height;
    //enemy spawn
    const enemyspawnlocation=1.1*width
    const enemyspawntime=3;
    const enemyspawnrange=2;
    const cactuslargeheightoffsetratio=0.07;
    //pixel_scale
    const player1=document.getElementById("player1");
    const pixel_scale=dinoheight/player1.height;
    
    //Classes
    class InputHandler {
        constructor(game){
            this.game = game;
            window.addEventListener("keydown", e => {
                if (((e.key === " ")||(e.key === "ArrowUp")||(e.key === "w"))&&(this.game.keyJump==false)){
                    this.game.keyJump=true;
                }
                else if (((e.key === "Shift")||(e.key === "ArrowDown")||(e.key === "s"))&&(this.game.keySneak==false)){
                    this.game.keySneak=true;
                }
                else if (e.key === "q"){
                    this.game.player.shoot()
                }
            });
            window.addEventListener("keyup", e => {
                if ((e.key === " ")||(e.key === "ArrowUp")||(e.key === "w")){
                    this.game.keyJump=false;
                }
                else if ((e.key === "Shift")||(e.key === "ArrowDown")||(e.key === "s")){
                    this.game.keySneak=false;
                }
            });
        }
    }
    class Projectile{
        constructor(game,x,y){
            this.game=game;
            this.x=x;
            this.y=y;
            this.width=10;
            this.height=3;
            this.realspeed=200;
            this.speed=this.realspeed*this.game.meter_scale;
            this.alive=true;
        }
        update(){
            this.x=this.x+this.speed*this.game.time;
            if (this.x>this.game.width*0.8) this.alive=false;
        }
        draw(context){
            context.fillstyle="yellow";
            context.fillRect(this.x, this.y, this.width, this.height);
        }


    }
    class Particle {

    }
    class Player{
        constructor(game){
            this.game=game;
            this.height=dinoheight;
            this.width =this.height*pixel_scale;
            this.x=20;
            this.y=100;
            this.speedY=0;
            this.projectiles=[];
            this.player1=player1
            this.player2=document.getElementById("player2");
            this.playerjump=document.getElementById("playerjump");
            this.playersneak1=document.getElementById("playersneak1");
            this.playersneak2=document.getElementById("playersneak2");
            this.current_player=this.player1;
            this.current_player_dt=0;
            this.current_gravity=gravity;
            this.frames = [[this.player1, this.player2],[this.playersneak1, this.playersneak2]];
            this.sneak=0;
            this.animframe=0;
        } 
        update(){
            
            if ((this.game.keyJump)&&(this.speedY==0)) {
                this.speedY=0-jumpspeed;
            }
            // gravity
            if ((this.current_gravity!=gravity)&&(this.y>=this.game.floor)){
                this.current_gravity=gravity
            }
            if ((this.game.keySneak)&&(this.current_gravity==gravity)&&(this.y<this.game.floor)){
                this.current_gravity=gravity*sneakgravityfactor
            }
            if ((this.speedY!=0)||(this.y<this.game.floor)){
                const next_y= this.y + (this.speedY*this.game.time) + (0.5*this.current_gravity*(this.game.time**2))
                if (next_y>=this.game.floor){
                    this.y=this.game.floor;
                    this.speedY=0;
                }
                else{
                    this.y=next_y;
                    this.speedY=this.speedY+this.current_gravity*this.game.time;
                }
            } 
            
            // projectile
            this.projectiles.forEach(projectile => {
                projectile.update();
            })
            this.projectiles=this.projectiles.filter(projectile => projectile.alive);

            // animation frame
            if (this.game.keySneak){
                this.sneak=1;
            } else{
                this.sneak=0;
            }
            if (this.current_player_dt > animationspeedpersecond) {
                this.current_player_dt = 0;
                this.animframe=(this.animframe+1)%2
            } else {
                this.current_player_dt += this.game.time;
            }
            if (this.y<this.game.floor){
                this.current_player=this.playerjump
            } else{
                this.current_player=this.frames[this.sneak][this.animframe]
            }
        }

        draw(context){
            context.fillstyle="black";
            //context.fillRect(this.x, this.y, this.width, this.height);
            context.drawImage(this.current_player,this.x, this.y,this.width,this.height)
            this.projectiles.forEach(projectile => {
                projectile.draw(context);
            })
        }
        shoot(){
            this.projectiles.push(new Projectile(this.game,this.x,this.y));
        }
    }
    class Cactus{
        constructor(game,cactus,offset){
            this.game=game;
            this.cactus=cactus;
            this.width=this.cactus.width*pixel_scale;
            this.height=this.cactus.height*pixel_scale;
            this.x=enemyspawnlocation+offset;
            if (this.cactus.height==100) this.y=lowlevel-this.height+(cactuslargeheightoffsetratio*this.height);
            else this.y=lowlevel-this.height;
            this.alive=true;
        }
        update(){
            if (this.x<=-this.width) this.alive=false;
            else this.x=this.x-dinorunspeed*this.game.time;
        }
        draw(context){
            context.drawImage(this.cactus,this.x,this.y,this.width,this.height)
        }
    }
    class EnemyController{
        constructor(game){
            this.game=game;
            this.enemyspawndt=0;
            this.enemycategory=0;
            this.cactuscount=0;
            this.cactusrandom=0;
            this.cactus=player1;
            this.enemylist=[];
            this.enemyspawnrandomtimerange=(enemyspawntime-(enemyspawnrange/2)+Math.random()*enemyspawnrange);
        }
        update(){
            if (this.enemyspawndt>=this.enemyspawnrandomtimerange){
                this.enemyspawnrandomtimerange=(enemyspawntime-(enemyspawnrange/2)+Math.random()*enemyspawnrange);
                this.enemyspawndt=0;
                this.enemycategory=0;
                if (this.enemycategory==0){
                    this.cactuscount=0;
                    this.spawncactus(0);
                }
            }else this.enemyspawndt+=this.game.time;
            this.enemylist.forEach(enemy => {
                enemy.update();
            })
            this.enemylist=this.enemylist.filter(enemy => enemy.alive);
        }
        draw(context){
            this.enemylist.forEach(enemy => {
                enemy.draw(context);
            })
        }
        spawncactus(offset){
            if (this.cactuscount==0) this.cactusrandom=Math.floor(Math.random()*8);
            else this.cactusrandom=Math.floor(Math.random()*7)
            this.cactus=document.getElementById("cactus"+String(this.cactusrandom+1));
            this.enemylist.push(new Cactus(this.game,this.cactus,offset))
            this.cactuscount+=1
            if ((this.cactus.width<150)&&(this.cactuscount<3)){
                this.spawncactus(offset+(this.cactus.width*pixel_scale))
            }    
        }
    }
    class Layer{

    }
    class Background{
        constructor(game){
            this.game=game;
            this.background=document.getElementById("background");
            this.height=this.background.height*pixel_scale;
            this.width=this.background.width*pixel_scale;
            this.x=0;
            this.y=this.game.floor+dinoheight-(realfloorheightonimagefromtop*pixel_scale);
        }
        update(){
            if (this.x<=-this.width) this.x=0;
            else this.x=this.x-dinorunspeed*this.game.time;
        }
        draw(context){
            context.drawImage(this.background,this.x,this.y,this.width,this.height)
            context.drawImage(this.background,this.x+this.width,this.y,this.width,this.height)
        }
    }
    class UI{

    }
    class Game{
        constructor(){
            this.width = width;
            this.height = height;
            this.floor=floor;
            this.meter_scale=meter_scale;
            this.time_scale=initial_time_scale;
            this.enemies=new EnemyController(this);
            this.player=new Player(this);
            this.input=new InputHandler(this);
            this.background=new Background(this);
            this.last_time=performance.now();
            this.current_time=performance.now();
            this.delta_time=0;
            this.time=this.delta_time*this.time_scale;
            //keys
            this.keyJump=false;
            this.keySneak=false;
            //this.keys=[];
        }
        update(){
            this.current_time=performance.now()
            this.delta_time=(this.current_time-this.last_time)/1000 
            this.time=this.delta_time*this.time_scale
            this.last_time=this.current_time
            this.enemies.update();
            this.player.update();
            this.background.update()
        }
        draw(context){
            this.background.draw(context);
            this.enemies.draw(context);
            this.player.draw(context);
        }
        detect_collision(obj1,obj2){
            return(
                obj1.x<obj2.x+obj2.width &&
                obj1.x+obj1.width>obj2.x &&
                obj1.y<obj2.y+obj2.height &&
                obj1.y+obj1.height>obj2.y
            )
        }
    }
    //actual code
    const game= new Game();
    function animation(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        game.update();
        game.draw(ctx);
        requestAnimationFrame(animation);
    }
    animation();
});