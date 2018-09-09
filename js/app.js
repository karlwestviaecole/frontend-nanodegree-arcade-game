/**
 * The board object contains size and coordinate information
 * about the board and its rows and columns.
 */
const board = (function () {

    const xMin = 0;
    const yMin = 0;
    const colWidth = 101;
    const rowHeight = 83;
    const numCols = 5;
    const numRows = 6;
    const xMax = (() => xMin + numCols * colWidth)();
    const yMax = (() => yMin + numRows * rowHeight)();

    /**
     * The x position for a given column number, starting at 1.
     * 
     * @param {number} col
     * @returns {number} x position for given col
     */
    const colX = col => (col - 1) * colWidth;

    /**
     * The y position for a given row number, starting at 1.
     * 
     * @param {number} row
     * @returns {number} y position for given row
     */
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

/**
 * The Enemy class
 */
class Enemy {

    constructor() {
        this.xMax = board.xMax;
        this.sprite = 'images/enemy-bug.png';
        this.spriteTopOffset = -22;
        this.width = board.colWidth;
        this.height = board.rowHeight;
        Enemy.reset(this);
    }

    /**
     * Reset enemy position.
     */
    static reset(enemy) {
        enemy.x = getRandomInt(-300, -100); // simulate randow delay before entering the game again
        enemy.y = board.rowY(getRandomInt(1, board.numRows)) + enemy.spriteTopOffset; // random row
        enemy.speed = getRandomInt(100, 300);
    }

    /** 
     * The x position as perceived by the user.
     * This value is used for collision detection.
     */
    get visualX() {
        return this.x;
    }

    /** 
     * The y position as perceived by the user.
     * This value is used for collision detection.
     */
    get visualY() {
        return this.y - this.spriteTopOffset;
    }

    /**
     * Update enemy position. Called by the game engine.
     */
    update(dt) {
        if (this.x > this.xMax) {
            Enemy.reset(this);
        } else {
            this.x += dt * this.speed;
        }
        if (collides(this, player)) {
            // Reset player if collides with enemy
            Player.reset(player);
        }
    }

    /**
     * Render enemy. Called by the game engine.
     */
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

/**
 * The Player class
 */
class Player {

    constructor() {
        this.sprite = 'images/char-boy.png';
        this.spriteTopOffset = -10;
        this.xMin = board.xMin;
        this.yMin = board.yMin + this.spriteTopOffset;
        this.xMax = board.xMax - board.colWidth;
        this.yMax = board.yMax - board.rowHeight + this.spriteTopOffset;
        this.width = board.colWidth;
        this.height = board.rowHeight;
        Player.reset(this);
    }

    /**
     * Reset player position.
     */
    static reset(player) {
        player.x = board.colX(3);
        player.y = board.rowY(board.numRows) + player.spriteTopOffset;
        player.move = null;
    }

    /** 
     * The x position as perceived by the user.
     * This value is used for collision detection.
     */
    get visualX() {
        return this.x;
    }

    /** 
     * The y position as perceived by the user.
     * This value is used for collision detection.
     */
    get visualY() {
        return this.y - this.spriteTopOffset;
    }

    /** 
     * Game won if player reached the
     * top edge of the game (yMin)
     */
    get won() {
        return this.y === this.yMin;
    }

    /**
     * Update player position. Called by the game engine.
     */
    update() {

        // Move player if move has a value, but keep the
        // player inside xMin, yMin, xMax and yMax
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
            
            // The move is handled, so reset to null
            this.move = null;
        }

        // Reset player if game is won
        if (this.won) {
            Player.reset(this);
        }
    }

    /**
     * Render player. Called by the game engine.
     */
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    /**
     * Set move value to given input key
     */
    handleInput(key) {
        this.move = key;
    }
}

/**
 * Contains all the enemy objects.
 */
const allEnemies = (function () {
    var numberOfEnemies = 3;
    var enemies = [];
    for (var i = 0; i < numberOfEnemies; i++) {
        enemies.push(new Enemy());
    }
    return enemies;
})();

/**
 * The player object.
 */
const player = new Player();

/**
 * Listen for keyup and notify player if arrow key.
 */
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});

/** 
 * Calculates if two object collides.
 * 
 * Implementation from Stack Overflow:
 * https://stackoverflow.com/a/14062645
 * 
 * @param {(Enemy|Player)} a
 * @param {(Enemy|Player)} b
 * @returns {boolean} true if a and b collides
 * 
 */
const collides = function (a, b) {
    if (a.visualX < b.visualX + b.width &&
        a.visualX + a.width > b.visualX &&
        a.visualY < b.visualY + b.height &&
        a.visualY + a.height > b.visualY) return true;
}

/** 
 * Get a random integer between two given numbers.
 * 
 * Implementation from MDN:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 * 
 * @param {number} min
 * @param {number} max
 * @returns {number} random integer between min (inclusive) and max (exclusive)
 * 
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}