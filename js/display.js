let map = Level.default;
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
let te = new TileEngine(document.getElementById("canvas"), levels, Player.defualt, 50);
//# sourceMappingURL=display.js.map