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
    const realdinosaurheight=5.3;
    const realdinosaurwidth=2;
    const realbirdheight=2;
    const realbirdwidth=5.3;
    const dinoheight=realdinosaurheight*meter_scale;
    const dinowidth=realdinosaurwidth*meter_scale;
    const birdheight=realbirdheight*meter_scale;
    const birdwidth=realbirdwidth*meter_scale;
    const floor=(floorfromtop-realdinosaurheight)*meter_scale;
    const gravity=9.8*meter_scale;
    const realjumpingspeed=3.27*3;
    const jumpspeed=realjumpingspeed*meter_scale;
    
    //Classes
    class InputHandler {
        constructor(game){
            this.game = game;
            window.addEventListener("keydown", e => {
                if ((    (e.key === " ") ) && (this.game.keys.indexOf(e.key) === -1)){
                    this.game.keys.push(e.key);
                }
                else if (e.key === "q"){
                    this.game.player.shoot()
                }
                console.log(this.game.keys);
            });
            window.addEventListener("keyup", e => {
                if (this.game.keys.indexOf(e.key) > -1){
                    this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
                }
                console.log(this.game.keys);
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
            this.realspeed=20;
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
<<<<<<< HEAD
            this.width =120;
            this.height=200;
=======
            this.width =dinowidth;
            this.height=dinoheight;
>>>>>>> 9e3d2cd (changed aspect ratio, added assets, centralized constants in one place)
            this.x=20;
            this.y=100;
            this.speedY=0;
            this.projectiles=[];
            this.player1=document.getElementById("player1");
            this.playerh2w=this.player1.height/this.player1.width;
        } 
        update(){
            if ((this.game.keys.includes(" "))&&(this.speedY==0)) {
                this.speedY=0-jumpspeed;
            }
            // gravity
            if ((this.speedY!=0)||(this.y<this.game.floor)){
                const next_y= this.y + (this.speedY*this.game.time) + (0.5*gravity*(this.game.time**2))
                if (next_y>=this.game.floor){
                    this.y=this.game.floor;
                    this.speedY=0;
                }
                else{
                    this.y=next_y;
                    this.speedY=this.speedY+gravity*this.game.time;
                }
            } 

            // projectile
            this.projectiles.forEach(projectile => {
                projectile.update();
            })
            this.projectiles=this.projectiles.filter(projectile => projectile.alive);
            
        }

        draw(context){
            context.fillstyle="black";
            context.fillRect(this.x, this.y, this.width, this.height);
            context.drawImage(this.player1,this.x, this.y,this.height/this.playerh2w,this.height)
            this.projectiles.forEach(projectile => {
                projectile.draw(context);
            })
        }
        shoot(){
            this.projectiles.push(new Projectile(this.game,this.x,this.y));
        }
    }
    class Enemy{

    }
    class Layer{

    }
    class Background{

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
            this.player=new Player(this);
            this.input=new InputHandler(this);
            this.keys=[];
            this.last_time=performance.now()
            this.current_time=performance.now()
            this.delta_time=0
            this.time=this.delta_time*this.time_scale
        }
        update(){
            this.current_time=performance.now()
            this.delta_time=(this.current_time-this.last_time)/1000 
            this.time=this.delta_time*this.time_scale
            this.last_time=this.current_time
            this.player.update();
        }
        draw(context){
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
