window.addEventListener("load",function(){
    //setup of canvas
    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext("2d");
    canvas.width = 1500;
    canvas.height = 500;
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
            this.realspeed=300;
            this.speed=this.realspeed*this.game.meter_scale;
            this.alive=true;
        }
        update(){
            this.x=this.x+this.speed*this.game.ingametime;
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
            this.width =120;
            this.height=190;
            this.x=20;
            this.y=100;
            this.speedY=0;
            this.initialspeedY=5;  
            this.projectiles=[];
        } 
        update(){
            if ((this.game.keys.includes(" "))&&(this.speedY==0)) {
                this.speedY= 0-(this.initialspeedY*this.game.meter_scale);
            }
            // gravity
            if ((this.speedY!=0)||(this.y<this.game.floor_y)){
                const gravity=9.8*this.game.meter_scale
                const next_y= this.y + (this.speedY*this.game.ingametime) + (0.5*gravity*(this.game.ingametime**2))
                if (next_y>=this.game.floor_y){
                    this.y=this.game.floor_y;
                    this.speedY=0;
                }
                else{
                    this.y=next_y;
                    this.speedY=this.speedY+gravity*this.game.ingametime;
                }
                console.log([next_y,this.y,this.speedY,gravity,this.game.ingametime])
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
        constructor(width,height){
            this.width = width;
            this.height = height;
            this.player=new Player(this);
            this.input=new InputHandler(this);
            this.keys=[];
            this.floor_y=300
            this.realheight=3;
            this.meter_scale=this.height/this.realheight;
            this.time_scale=0.8;
            this.last_time=performance.now()
            this.current_time=performance.now()
            this.delta_time=0
            this.ingametime=this.delta_time*this.time_scale
        }
        update(){
            this.current_time=performance.now()
            this.delta_time=(this.current_time-this.last_time)/1000
            this.ingametime=this.delta_time*this.time_scale
            this.last_time=this.current_time
            this.player.update();
        }
        draw(context){
            this.player.draw(context);
        }
    }
    const game= new Game(canvas.width,canvas.height);
    function animation(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        game.update();
        game.draw(ctx);
        requestAnimationFrame(animation);
    }
    animation();
});
