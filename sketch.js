let maze,
    fillSpeed = 2,
    hueChangeRate = 1,
    solution,
    visualised,
    initial,
    hue = 0,
    cellSize = 16;

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
    // hue += hueChangeRate;
    // hue %= 360;
    // colorMode(HSB);
    // fill(hue, 255, 255);
    // colorMode(RGB);
    fill(0, 255, 0);
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

        stroke(255, 255, 255);
        strokeWeight(cellSize / 4);
        for (let i = 0; i < solution.length; i++) {
            point(solution[i][1] * w + w / 2, solution[i][0] * h + h / 2);
        }
        noStroke();

        // Draw the solution
        for (let i = 0; i < visualised.length; i++) {
            updateHue();
            rect(visualised[i][1] * w, visualised[i][0] * h, w + 1, h + 1);
        }

        for (let i = 0; i < nextVisualisedCount; i++) {
            let next = solution[visualised.length];
            if (next) {
                updateHue();
                if (next) {
                    visualised.push(next);
                    rect(next[1] * w, next[0] * h, w + 1, h + 1);
                }
            }
        }
    }

    if (visualised.length === solution.length) {
        init();
    }
}