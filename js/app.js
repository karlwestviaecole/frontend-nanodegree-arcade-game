class Enemy {
    
    constructor() {
        this.x = getRandomInt(-300, -100);
        this.y = enemyLanes[getRandomInt(0, enemyLanes.length)];
        this.speed = getRandomInt(100, 300);
        this.sprite = 'images/enemy-bug.png';
    }

    update(dt) {
        if (this.x > 600) {
            this.x = getRandomInt(-300, -100);
            this.y = enemyLanes[getRandomInt(0, enemyLanes.length)];
            this.speed = getRandomInt(100, 300);
        } else {
            this.x += dt * this.speed;
        }
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

class Player {

    constructor() {
        this.x = 200;
        this.y = 404;
        this.sprite = 'images/char-boy.png';
    }

    update() { 
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    handleInput(key) {
        switch (key) {
            case 'left':
                this.x -= 100;
                break;
            case 'up':
                this.y -= 83;
                break;
            case 'right':
                this.x += 100;
                break;
            case 'down':
                this.y += 83;
                break;
        }
    }
}

const enemyLanes = [-20, 62, 146, 230, 310, 400];

const allEnemies = (function () {
    var numberOfEnemies = 3;
    var enemies = [];
    for (var i = 0; i < numberOfEnemies; i++) {
        enemies.push(new Enemy());
    }
    return enemies;
})();

const player = new Player();

document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// Function from MDN
// min is inclusive and max is exclusive
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; 
}