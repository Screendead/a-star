let maze,
    hueChangeRate = 1,
    solution,
    visualised,
    initial,
    hue = 0,
    cellSize = 8,
    timeout;

function setup() {
    createCanvas(innerWidth, innerHeight);
    maze = new Maze(
        Math.floor(innerWidth / cellSize / 2) * 2,
        Math.floor(innerHeight / cellSize / 2) * 2
    );
    init();
    frameRate(60);
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
    // fill(0, 255, 0);
}

function draw() {
    const success = visualised.length === solution.length;
    let current = timestamp();
    hue = 0;

    background(255);
    maze.draw();

    if (solution.length || visualised.length) {
        let w = width / maze.width;
        let h = height / maze.height;
        let elapsed = current - initial;

        // stroke(255, 255, 255);
        // strokeWeight(cellSize / 4);
        // for (let i = 0; i < solution.length; i++) {
        //     point(solution[i][1] * w + w / 2, solution[i][0] * h + h / 2);
        // }
        // noStroke();

        // Draw the solution
        for (let i = 0; i < visualised.length; i++) {
            updateHue();
            rect(visualised[i][1] * w, visualised[i][0] * h, w + 1, h + 1);
        }

        let next = solution[visualised.length];
        if (next) {
            if (next) {
                visualised.push(next);
                fill(255);
                rect(next[1] * w, next[0] * h, w + 1, h + 1);
            }
        }

        // Draw the completion percentage in the center of the maze
        let completion = Math.floor((visualised.length / solution.length) * 100);
        fill(255, 0, 0);
        updateHue();
        textSize(64);
        textFont("Helvetica");
        textStyle(BOLD);
        textAlign(CENTER, CENTER);
        text(completion + "%", width / 2, height / 2);
    }

    if (success) {
        if (!timeout) {
            noLoop();
            timeout = setTimeout(() => {
                init();
                loop();
                timeout = null;
            }, 2000);
        }
    }
}