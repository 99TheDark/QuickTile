interface Point {
    x: number;
    y: number;
}

interface PlayerSettings {
    width: number,
    height: number
}

interface LevelBitmapBlockMap {
    [index: string]: object
}

interface LevelBitmap {
    data: Array<string>,
    map: LevelBitmapBlockMap
}

class Color {
    r: number;
    g: number;
    b: number;
    a: number;

    constructor(r: number, g: number, b: number, a: number = 1) {
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
    static defualt: PlayerSettings = {
        width: 0.8,
        height: 1
    };

    x: number;
    y: number;
    xv: number;
    yv: number;
    width: number;
    height: number;

    constructor(width: number, height: number) {
        [this.width, this.height] = [width, height];

        this.reset(0, 0);
    }
    reset(x: number, y: number): void {
        [this.x, this.y] = [x, y];
        [this.xv, this.yv] = [0, 0];
    }
    toString() {
        return "[object Player]";
    }
}

class Level {
    static default: LevelBitmapBlockMap = {
        "-": Block,
        "@": Portal,
        "S": Spawn
    };

    bitmap: LevelBitmap;
    blocks: Array<Array<Block>>;
    width: number;
    height: number;
    spawn: Point;

    constructor(bitmap: LevelBitmap) {
        this.bitmap = bitmap;

        this.width = bitmap.data.reduce((acc, cur) => Math.max(acc, cur.length), 0);
        this.height = bitmap.data.length;

        this.blocks = Array(this.height).fill(null).map(() => Array(this.width).fill(null));
        
        this.bitmap.data.forEach((str, y) => [...str].forEach((ch, x) => {
            if(ch != " ") {
                let type: any = bitmap.map[ch];
                if(type == Spawn) {
                    this.spawn = {
                        x: x,
                        y: y
                    };
                } else {
                    this.set(x, y, new type);
                }
            }
        }));
    }
    get(x: number, y: number): Block {
        return this.blocks[y][x];
    }
    set(x: number, y: number, block: Block): void {
        this.blocks[y][x] = block;
    }
    forEach(func: Function): void {
        this.blocks.forEach((row, y) => row.forEach((block, x) => func(block, x, y)));
    }
    bitmapString(): string {
        return this.bitmap.data.join("\n");
    }
    toString() {
        return "[object Level]";
    }
}

class LevelCollection {
    levels: Array<Level>;

    constructor(levels: Array<Array<string>>, map: LevelBitmapBlockMap) {
        this.levels = [];
        levels.forEach(level => this.levels.push(new Level({
            data: level,
            map: map
        })));
    }
    get(index: number): Level {
        return this.levels[index];
    }
    toString() {
        return "[object LevelCollection]";
    }
}

class MovementDetection {
    left: boolean;
    right: boolean;
    jump: boolean;

    constructor() {
        [this.left, this.right, this.jump] = Array(3).fill(false);

        document.addEventListener("keydown", e => {
            if(e.key == "a") this.left = true;
            if(e.key == "d") this.right = true;
            if(e.key == "w") this.jump = true;
        });
        document.addEventListener("keyup", e => {
            if(e.key == "a") this.left = false;
            if(e.key == "d") this.right = false;
            if(e.key == "w") this.jump = false;
        });
    }
}

class TileEngine {
    levels: LevelCollection;
    player: Player;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    scale: number;
    levelidx: number;
    keys: MovementDetection;

    constructor(canvas: HTMLCanvasElement, levels: LevelCollection, playerSettings: PlayerSettings, scale: number) {
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
            let {ctx, width, height, player, scale} = this;

            ctx.clearRect(0, 0, width, height);

            // TODO: Calculate collidable blocks

            level.forEach((block: any, x: number, y: number) => {
                if(block) {
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
    levelNumber(): number {
        return this.levelidx + 1;
    }
    currentLevel(): Level {
        return this.levels.get(this.levelidx);
    }
    nextLevel(): void {
        this.levelidx++;
    }
}
