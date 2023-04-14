let map: LevelBitmapBlockMap = Level.default;

let levels = new LevelCollection([
    [
        "--            --",
        "--   @        --",
        "--   ---      --",
        "--         -----",
        "--        ------",
        "-- S     -------",
        "----------------"
    ], [
        "-S     -",
        "------ -",
        "     - -",
        "     - -",
        "     - -",
        "  ---- -",
        "  - ----",
        "--- -   ",
        "-@  -   ",
        "-----   "
    ]
], map);

let te = new TileEngine(
    document.getElementById("canvas") as HTMLCanvasElement,
    levels,
    Player.defualt,
    50
);