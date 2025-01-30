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
    //timescale
    const initial_time_scale=0.9;
    const timescaleincreasepersecond=0.01;
    const timescalemax=2;
    //calculated values setup
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
    const midlevel=0.55*height;
    const highlevel=0.2*height;
    //enemy spawn
    const enemyspawnlocation=1.1*width
    const enemyspawntime=3;
    const enemyspawnrange=2;
    const cactuslargeheightoffsetratio=0.07;
    const enemyspeed=dinorunspeed;
    const enemydeathanimframetime=Math.sqrt((0.4*realheight)/(0.5*9.8));
    //pixel_scale
    const player1=document.getElementById("player1");
    const pixel_scale=dinoheight/player1.height;
    //projectile
    const projectileradius=0.23*meter_scale;
    const projectilexpercentage=0.55;
    const projectileypercentage=0.6;
    const projectilereloadtime=1.5;
    const projectilespeed=23.469*meter_scale
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
                else if ((e.key === "q")&&(this.game.player.projectiles[0].status==1)){
                    this.game.shoot=true;
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
            this.centerx=x;
            this.centery=y;
            this.radius=0;
            this.width=this.radius*2
            this.height=this.radius*2
            this.x=this.centerx-this.radius;
            this.y=this.centery-this.radius;
            this.speed=0;
            this.alive=true;
            this.status=0;
            this.reloadtimedt=0;
        }
        update(x,y){
            if (this.status<2){
                this.centerx=x;
                this.centery=y;
                this.width=this.radius*2
                this.height=this.radius*2  
            }
            this.x=this.centerx-this.radius;
            this.y=this.centery-this.radius;
            if (this.status==0)
                if (this.reloadtimedt>=projectilereloadtime){
                    this.reloadtimedt=0;
                    this.status=1;
                    this.radius=projectileradius;
                } else{
                    this.reloadtimedt+=this.game.time;
                    this.radius=projectileradius*(this.reloadtimedt/projectilereloadtime)
                }
            if ((this.game.shoot)&&(this.status==1)){
                this.game.shoot=false;
                this.status=2;
                this.speed=projectilespeed-dinorunspeed;
            }
            if (this.status==2){
                this.centerx+=this.speed*this.game.time;
            }
            if (this.centerx>this.game.width) this.alive=false;
        }
        draw(context){
            context.beginPath();
            context.arc(this.centerx, this.centery, this.radius, 0, 2 * Math.PI, false);
            context.fillStyle = '#ff2600';
            context.fill();
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
            this.projectilex=this.x+this.width*projectilexpercentage
            this.speedY=0;
            this.projectiles=[new Projectile(this.game,this.projectilex,this.y+this.height*projectileypercentage)];
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
                this.current_gravity=gravity;
            }
            if ((this.game.keySneak)&&(this.current_gravity==gravity)&&(this.y<this.game.floor)){
                this.current_gravity=gravity*sneakgravityfactor
            }
            if ((this.speedY!=0)||(this.y<this.game.floor)){
                const next_y= this.y + (this.speedY*this.game.time)
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
            if (this.projectiles[0].centerx>this.projectilex){
                this.projectiles.unshift(new Projectile(this.game, this.projectilex,this.y+this.height*projectileypercentage))
            }
            this.projectiles.forEach(projectile => {
                projectile.update(this.projectilex,this.y+this.height*projectileypercentage);
            })
            this.projectiles=this.projectiles.filter(projectile => projectile.alive);

            // animation frame
            if (this.game.keySneak){
                this.sneak=1;
            } else{
                this.sneak=0;
            }
            if (this.current_player_dt > animationspeedpersecond) {
                this.game.enemies.enemylist.forEach(enemy => enemy.animate())
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
    }
    class Enemy{
        constructor(game){
            this.game=game;
            this.category=Math.floor(Math.random()*2);
            this.status=0;
            this.dino1=document.getElementById("dino1");
            this.dino2=document.getElementById("dino2");
            this.dinoshocked=document.getElementById("dinoshocked");
            this.bird1=document.getElementById("bird1");
            this.bird2=document.getElementById("bird2");
            this.birdshocked=document.getElementById("birdshocked");
            this.frames=[[[this.dino1,this.dino2],[this.bird1,this.bird2]],[[this.dinoshocked],[this.birdshocked]]]
            this.current_frame=this.frames[this.status][this.category][0];
            this.width=this.current_frame.width*pixel_scale;
            this.height=this.current_frame.height*pixel_scale;
            this.x=enemyspawnlocation;
            if (this.category==0) this.y=lowlevel-this.height;
            else this.y=midlevel-this.height;
            this.alive=true;
            this.enemyanimframe=0;
            this.death_dt=0;
            this.speedY=0;
            this.closest_projectile=this.game.player.projectiles[this.game.player.projectiles.length-1];
        }
        update(){
            this.closest_projectile=this.game.player.projectiles[this.game.player.projectiles.length-1];
            if ((this.status==0)&&(this.game.detect_collision(this,this.closest_projectile))&&(this.closest_projectile.speed!=0)){
                this.status=1;
                this.closest_projectile.alive=false;
            }
            if (this.status==0){
                if (this.x<=-this.width) this.alive=false;
                else this.x=this.x-(dinorunspeed+enemyspeed)*this.game.time;
            } else if (this.status==1){
                if (this.death_dt==0){
                    this.enemyanimframe=0;
                } else if ((this.death_dt>=enemydeathanimframetime)||((this.category==1)&&(this.y==this.game.floor))){
                    this.alive=false;
                    this.death_dt=-1
                }
                if (this.alive){
                    this.death_dt+=this.game.time;
                }
                if (this.y<this.game.floor){
                    const enemy_next_y= this.y + (this.speedY*this.game.time)
                    if (enemy_next_y>=this.game.floor){
                        this.y=this.game.floor;
                        this.speedY=0;
                    }
                    else{
                        this.y=enemy_next_y;
                        this.speedY=this.speedY+gravity*this.game.time;
                    }
                }
                if (this.category==0) this.x=this.x-dinorunspeed*this.game.time;
                else if (this.category==1) this.x=this.x-(dinorunspeed+enemyspeed)*this.game.time;
                this.current_frame=this.frames[this.status][this.category][this.enemyanimframe];
                if ((this.category==1)&&(this.y==this.game.floor)){
                    this.alive=false;
                    this.death_dt=-1
                }
            }
        }
        animate(){
            if (this.status==0){
                this.enemyanimframe=(this.enemyanimframe+1)%2;
                this.current_frame=this.frames[this.status][this.category][this.enemyanimframe];
            }
            
        }
        draw(context){
            context.drawImage(this.current_frame,this.x,this.y,this.width,this.height)
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
            this.cactuscount=0;
            this.cactusrandom=0;
            this.cactus=player1;
            this.enemylist=[];
            this.cactuslist=[];
            this.enemyspawnrandomtimerange=(enemyspawntime-(enemyspawnrange/2)+Math.random()*enemyspawnrange);
        }
        update(){
            if (this.enemyspawndt>=this.enemyspawnrandomtimerange){
                this.enemyspawnrandomtimerange=(enemyspawntime-(enemyspawnrange/2)+Math.random()*enemyspawnrange);
                this.enemyspawndt=0;
                //cactus spawning
                this.cactuscount=0;
                this.spawncactus(0);
                //enemy spawning
                this.enemylist.push(new Enemy(this.game))
            }else this.enemyspawndt+=this.game.time;
            this.enemylist.forEach(enemy => {
                enemy.update();
            })
            this.enemylist=this.enemylist.filter(enemy => enemy.alive);
            this.cactuslist.forEach(cactus => {
                cactus.update();
            })
            this.cactuslist=this.cactuslist.filter(cactus => cactus.alive);
        }
        draw(context){
            this.enemylist.forEach(enemy => {
                enemy.draw(context);
            })
            this.cactuslist.forEach(cactus => {
                cactus.draw(context);
            })
        }
        spawncactus(offset){
            if (this.cactuscount==0) this.cactusrandom=Math.floor(Math.random()*8);
            else this.cactusrandom=Math.floor(Math.random()*7)
            this.cactus=document.getElementById("cactus"+String(this.cactusrandom+1));
            this.cactuslist.push(new Cactus(this.game,this.cactus,offset))
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
            this.shoot=false;
        }
        update(){
            this.current_time=performance.now()
            this.delta_time=(this.current_time-this.last_time)/1000 
            this.time=this.delta_time*this.time_scale
            this.last_time=this.current_time
            this.background.update();
            this.player.update();
            this.enemies.update();
            if (this.time_scale>=timescalemax) this.time_scale=timescalemax;
            else this.time_scale+=timescaleincreasepersecond*this.delta_time;
        }
        draw(context){
            this.background.draw(context);
            this.player.draw(context);
            this.enemies.draw(context);
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