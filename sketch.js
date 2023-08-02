let maze,
    fillSpeed = 2,
    hueChangeRate = 1,
    solution,
    visualised,
    initial,
    hue = 0,
    cellSize = 8;

function setup() {
    createCanvas(innerWidth, innerHeight);
    maze = new Maze(
        Math.floor(innerWidth / cellSize / 2) * 2,
        Math.floor(innerHeight / cellSize / 2) * 2
    );
    init();
}

function init() {
    initial = timestamp();
    maze.generate();
    solution = maze.solve();
    visualised = [];
}

function timestamp() {
    return new Date().getTime() / 1000;
}

function updateHue() {
    hue += hueChangeRate;
    hue %= 360;
    colorMode(HSB);
    fill(hue, 255, 255);
    colorMode(RGB);
}

function draw() {
    let current = timestamp();
    hue = 0;

    background(255);
    maze.draw();

    if (solution.length || visualised.length) {
        let w = width / maze.width;
        let h = height / maze.height;
        let elapsed = current - initial;
        let nextVisualisedCount = Math.ceil(elapsed * fillSpeed);

        // Draw the solution
        for (let i = 0; i < visualised.length; i++) {
            updateHue();
            rect(visualised[i][1] * w, visualised[i][0] * h, w + 1, h + 1);
        }

        for (let i = 0; i < nextVisualisedCount; i++) {
            if (solution.length) {
                let next = solution.shift();
                updateHue();
                rect(next[1] * w, next[0] * h, w + 1, h + 1);
                if (next) {
                    visualised.push(next);
                }
            }
        }
    }

    if (solution.length === visualised.length) {
        init();
    }
}