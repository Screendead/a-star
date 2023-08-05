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
    const success = visualised.length === solution.length,
        percentage = visualised.length / solution.length,
        completion = Math.floor(percentage * 100),
        w = width / maze.width,
        h = height / maze.height,
        current = timestamp(),
        elapsed = current - initial;
        timeRemaining = elapsed * (1 - percentage) / percentage,
        minutes = Math.floor(timeRemaining / 60),
        seconds = Math.floor(timeRemaining % 60);
    hue = 0;

    background(255);
    maze.draw();

    if (solution.length || visualised.length) {
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

        // Draw the time remaining in the bottom right corner
        updateHue();
        stroke(0);
        strokeWeight(4);
        textSize(32);
        textFont("Helvetica");
        textStyle(BOLD);
        textAlign(RIGHT, TOP);
        text(completion + "% COMPLETED. TIME REMAINING " + minutes + ":" + (seconds < 10 ? "0" : "") + seconds, width - 16, 16);
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