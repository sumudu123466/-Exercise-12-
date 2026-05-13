const Game = {
    score: 0,
    level: 1,
    speed: 15, 
    active: false,
    enemies: [],

    init: function() {
        document.getElementById('start-btn').addEventListener('click', () => this.start());
        document.addEventListener('keydown', (e) => this.movePlayer(e));
    },

    start: function() {
        this.active = true;
        this.score = 0;
        this.level = 1;
        this.speed = 3;
        this.enemies = [];
        
        
        document.querySelectorAll('.enemy').forEach(el => el.remove());
        
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('road').classList.add('road-animate');
        this.loop();
    },

    movePlayer: function(e) {
        if (!this.active) return;
        const player = document.getElementById('player');
        let left = player.offsetLeft;
        const roadWidth = document.getElementById('road').offsetWidth;

        if (e.key === "ArrowLeft" && left > 10) {
            player.style.left = (left - 20) + "px";
        }
        if (e.key === "ArrowRight" && left < (roadWidth - 70)) {
            player.style.left = (left + 20) + "px";
        }
    },

    loop: function() {
        if (!this.active) return;

        this.score++;
        document.getElementById('score').innerText = this.score;
        if (this.score % 600 === 0 && this.level < 4) {
            this.level++;
            this.speed += 1;
            document.getElementById('level').innerText = this.level;
        }
        if (Math.random() < 0.015) {
            this.enemies.push(new Enemy(this.speed));
        }

        this.enemies.forEach((en, i) => {
            en.update();
            if (en.checkHit()) this.end();
            if (en.y > window.innerHeight) {
                en.el.remove();
                this.enemies.splice(i, 1);
            }
        });

        requestAnimationFrame(() => this.loop());
    },

    end: function() {
        this.active = false;
        document.getElementById('road').classList.remove('road-animate');
        document.getElementById('msg').innerText = "GAME OVER!";
        document.getElementById('start-btn').innerText = "RESTART";
        document.getElementById('overlay').style.display = 'flex';
    }
};


function Enemy(speed) {
    this.speed = speed;
    this.y = -120;
    const road = document.getElementById('road');
    this.x = Math.random() * (road.offsetWidth - 60);
    
    this.el = document.createElement('div');
    this.el.className = 'enemy';
    this.el.style.left = this.x + 'px';
    this.el.style.top = this.y + 'px';
    road.appendChild(this.el);
}

Enemy.prototype.update = function() {
    this.y += this.speed;
    this.el.style.top = this.y + 'px';
};

Enemy.prototype.checkHit = function() {
    const p = document.getElementById('player').getBoundingClientRect();
    const e = this.el.getBoundingClientRect();

    return !(p.top > e.bottom || p.bottom < e.top || p.left > e.right || p.right < e.left);
};


Game.init();