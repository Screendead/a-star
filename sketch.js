const maze = new Maze(100, 100),
    fillSpeed = 10,
    hueChangeRate = 0.0;
let solution, visualised, initial, hue = 0;

function timestamp() {
    return new Date().getTime() / 1000;
}

function setup() {
    createCanvas(innerWidth, innerHeight);

    init();
}

function init() {
    initial = timestamp();
    maze.generate();
    solution = maze.solve();
    visualised = [];
}

function updateHue() {
    hue += hueChangeRate;
    hue %= 360;
    colorMode(HSB);
    fill(hue, 255, 255);
    colorMode(RGB);
}

function draw() {
    hue = 0;
    let current = timestamp();

    background(255);
    maze.draw();

    if (solution.length || visualised.length) {
        let w = width / maze.width;
        let h = height / maze.height;
        let elapsed = current - initial;
        console.log(elapsed, fillSpeed);
        let totalVisualised = Math.floor(elapsed * fillSpeed);

        // Draw the solution
        for (let i = 0; i < visualised.length; i++) {
            updateHue();
            rect(visualised[i][1] * w, visualised[i][0] * h, w, h);
        }

        for (let i = 0; i < totalVisualised; i++) {
            if (solution.length) {
                updateHue();
                rect(solution[0][1] * w, solution[0][0] * h, w, h);
                visualised.push(solution.shift());
            }
        }
    }

    if (!solution.length) {
        init();
    }
}