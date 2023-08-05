let maze,
    hueChangeRate = 1,
    solution,
    visualised,
    initial,
    hue = 0,
    cellSize = 16,
    timeout
    first = true,
    cellsToVisualisePerFrame = 1;

function setup() {
    createCanvas(innerWidth, innerHeight);
    maze = new Maze(
        Math.floor(innerWidth / cellSize / 2) * 2,
        Math.floor(innerHeight / cellSize / 2) * 2
    );
    init();
}

function init() {
    first = true;
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
    // colorMode(HSB);
    // fill(hue, 255, 255);
    // colorMode(RGB);
    fill(0, 255, 0);
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
        seconds = (Math.round(timeRemaining * 10) / 10) % 60;
    hue = 0;

    // background(255);
    if (first) {
        first = false;
        maze.draw();
    }

    if (solution.length || visualised.length) {
        stroke(255);
        strokeWeight(4);
        for (let i = 0; i < solution.length; i++) {
            point(solution[i][1] * w + w / 2, solution[i][0] * h + h / 2);
        }
        noStroke();

        for (let i = 0; i < cellsToVisualisePerFrame && visualised.length + i < solution.length; i++) {
            let next = solution[visualised.length];
            if (next) {
                if (next) {
                    visualised.push(next);
                    fill(255);
                    rect(next[1] * w, next[0] * h, w + 1, h + 1);
                }
            }
        }

        // Draw the solution
        for (let i = 0; i < visualised.length; i++) {
            updateHue();
            rect(visualised[i][1] * w, visualised[i][0] * h, w + 1, h + 1);
        }

        const hud = completion + "% COMPLETED. TIME REMAINING: " + (
            timeRemaining === Infinity
                ? "∞"
                : ((minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds.toFixed(1))
        );
        textSize(32);
        textFont("Helvetica");
        textStyle(BOLD);
        textAlign(RIGHT, TOP);

        // Draw the start and end points
        fill(255, 0, 0);
        rect(maze.start[1] * w, maze.start[0] * h, w + 1, h + 1);
        fill(255, 0, 0);
        rect(maze.end[1] * w, maze.end[0] * h, w + 1, h + 1);

        // Draw the background for the time remaining
        fill(0);
        noStroke();
        rect(width - 4 - textWidth(hud), 0, textWidth(hud) + 4, 40);

        // Draw the time remaining in the top right corner
        fill(255, 0, 0);
        text(hud, width, 0);
    }

    if (success) {
        init();
        // if (!timeout) {
        //     noLoop();
        //     timeout = setTimeout(() => {
        //         init();
        //         loop();
        //         timeout = null;
        //     }, 2000);
        // }
    }
}