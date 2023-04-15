class Color {
    r;
    g;
    b;
    a;
    constructor(r, g, b, a = 1) {
        [this.r, this.g, this.b, this.a] = [r, g, b, a];
    }
    toString() {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }
}
class Block {
    static color = new Color(0, 0, 0);
    toString() {
        return "[object Block]";
    }
}
class Portal extends Block {
    static color = new Color(170, 26, 186);
    toString() {
        return "[object Portal]";
    }
}
class Spawn {
    toString() {
        return "[object Spawn]";
    }
}
class Player {
    static color = new Color(180, 0, 0);
    static defualt = {
        width: 0.8,
        height: 1
    };
    x;
    y;
    xv;
    yv;
    width;
    height;
    constructor(width, height) {
        [this.width, this.height] = [width, height];
        this.reset(0, 0);
    }
    reset(x, y) {
        [this.x, this.y] = [x, y];
        [this.xv, this.yv] = [0, 0];
    }
    toString() {
        return "[object Player]";
    }
}
class Level {
    static default = {
        "-": Block,
        "@": Portal,
        "S": Spawn
    };
    bitmap;
    blocks;
    width;
    height;
    spawn;
    constructor(bitmap) {
        this.bitmap = bitmap;
        this.width = bitmap.data.reduce((acc, cur) => Math.max(acc, cur.length), 0);
        this.height = bitmap.data.length;
        this.blocks = Array(this.height).fill(null).map(() => Array(this.width).fill(null));
        this.bitmap.data.forEach((str, y) => [...str].forEach((ch, x) => {
            if (ch != " ") {
                let type = bitmap.map[ch];
                if (type == Spawn) {
                    this.spawn = {
                        x: x,
                        y: y
                    };
                }
                else {
                    this.set(x, y, new type);
                }
            }
        }));
    }
    get(x, y) {
        return this.blocks[y][x];
    }
    set(x, y, block) {
        this.blocks[y][x] = block;
    }
    forEach(func) {
        this.blocks.forEach((row, y) => row.forEach((block, x) => func(block, x, y)));
    }
    bitmapString() {
        return this.bitmap.data.join("\n");
    }
    toString() {
        return "[object Level]";
    }
}
class LevelCollection {
    levels;
    constructor(levels, map) {
        this.levels = [];
        levels.forEach(level => this.levels.push(new Level({
            data: level,
            map: map
        })));
    }
    get(index) {
        return this.levels[index];
    }
    toString() {
        return "[object LevelCollection]";
    }
}
class MovementDetection {
    keys;
    constructor() {
        this.keys = new Map();
        document.addEventListener("keydown", e => {
            this.keys.set(e.key, true);
        });
        document.addEventListener("keyup", e => {
            this.keys.set(e.key, false);
        });
    }
    down(key) {
        return this.keys.get(key) ?? false;
    }
    up(key) {
        return !this.keys.get(key) ?? true;
    }
}
class TileEngine {
    levels;
    player;
    canvas;
    ctx;
    width;
    height;
    scale;
    levelidx;
    keys;
    constructor(canvas, levels, playerSettings, scale) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.levels = levels;
        this.player = new Player(playerSettings.width, playerSettings.height);
        this.scale = scale;
        this.levelidx = 0;
        this.keys = new MovementDetection();
        let level = this.currentLevel();
        this.player.reset(level.spawn.x, level.spawn.y);
        let canvasStyle = getComputedStyle(canvas);
        [this.canvas.width, this.canvas.height] = [parseInt(canvasStyle.width), parseInt(canvasStyle.height)];
        [this.width, this.height] = [this.canvas.width, this.canvas.height];
        let draw = () => {
            const { ctx, width, height, player, scale, keys } = this;
            ctx.clearRect(0, 0, width, height);
            // keys.down("w")
            // TODO: Calculate collidable blocks
            level.forEach((block, x, y) => {
                if (block) {
                    ctx.fillStyle = block.constructor.color.toString();
                    ctx.fillRect(x * scale, y * scale, scale, scale);
                }
            });
            ctx.fillStyle = Player.color.toString();
            ctx.fillRect(player.x * scale, player.y * scale, player.width * scale, player.height * scale);
            requestAnimationFrame(draw);
        };
        requestAnimationFrame(draw);
    }
    levelNumber() {
        return this.levelidx + 1;
    }
    currentLevel() {
        return this.levels.get(this.levelidx);
    }
    nextLevel() {
        this.levelidx++;
    }
}
//# sourceMappingURL=script.js.map
