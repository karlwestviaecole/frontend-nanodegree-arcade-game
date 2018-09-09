class Enemy {

    constructor() {
        this.xMax = board.xMax;
        this.offsetTop = -22;
        this.sprite = 'images/enemy-bug.png';
        this.width = board.colWidth;
        this.height = board.rowHeight;
        Enemy.reset(this);
    }

    get visualX() {
        return this.x;
    }

    get visualY() {
        return this.y - this.offsetTop;
    }

    static reset(enemy) {
        enemy.x = getRandomInt(-300, -100);
        enemy.y = board.rowY(getRandomInt(1, board.numRows)) + enemy.offsetTop;
        enemy.speed = getRandomInt(100, 300);
    }

    update(dt) {
        if (this.x > this.xMax) {
            Enemy.reset(this);
        } else {
            this.x += dt * this.speed;
        }
        if (collides(this, player)) {
            Player.reset(player);
        }
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

class Player {

    constructor() {
        this.offsetTop = -10;
        this.sprite = 'images/char-boy.png';
        this.xMin = board.xMin;
        this.yMin = board.yMin + this.offsetTop;
        this.xMax = board.xMax - board.colWidth;
        this.yMax = board.yMax - board.rowHeight + this.offsetTop;
        this.width = board.colWidth;
        this.height = board.rowHeight;
        Player.reset(this);
    }

    get visualX() {
        return this.x;
    }

    get visualY() {
        return this.y - this.offsetTop;
    }

    static reset(player) {
        player.x = board.colX(3);
        player.y = board.rowY(board.numRows) + player.offsetTop;
        player.move = null;
    }

    update() {
        if (this.move) {
            switch (this.move) {
                case 'left':
                    if (this.x - board.colWidth >= this.xMin) {
                        this.x -= board.colWidth;
                    }
                    break;
                case 'up':
                    if ((this.y - board.rowHeight) >= this.yMin) {
                        this.y -= board.rowHeight;
                    }
                    break;
                case 'right':
                    if (this.x + board.colWidth <= this.xMax) {
                        this.x += board.colWidth;
                    }
                    break;
                case 'down':
                    if ((this.y + board.rowHeight) <= this.yMax) {
                        this.y += board.rowHeight;
                    }
                    break;
            }
            this.move = null;
        }
        if(this.y === this.yMin) {
            Player.reset(this);
        }
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    handleInput(key) {
        this.move = key;
    }
}

const board = (function () {

    const xMin = 0;
    const yMin = 0;
    const colWidth = 101;
    const rowHeight = 83;
    const numCols = 5;
    const numRows = 6;
    const xMax = (() => xMin + numCols * colWidth)();
    const yMax = (() => yMin + numRows * rowHeight)();
    const colX = col => (col - 1) * colWidth;
    const rowY = row => (row - 1) * rowHeight;

    return {
        'xMin': xMin,
        'yMin': yMin,
        'colWidth': colWidth,
        'rowHeight': rowHeight,
        'numCols': numCols,
        'numRows': numRows,
        'xMax': xMax,
        'yMax': yMax,
        'colX': colX,
        'rowY': rowY
    };

})();

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

const collides = function (a, b) {
    if (a.visualX < b.visualX + b.width &&
        a.visualX + a.width > b.visualX &&
        a.visualY < b.visualY + b.height &&
        a.visualY + a.height > b.visualY) return true;
}

// min is inclusive and max is exclusive
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}