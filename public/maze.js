class Maze {
    constructor(width, height) {
        this.width = width + 1;
        this.height = height + 1;
        this.directions = [[-1, 0], [1, 0], [0, 1], [0, -1]];
        this.start = [1, 1];
        this.end = [height - 1, width - 1];
    }

    /**
     * @description Create 2D array
     * @memberof Maze
     * @returns {Array}
     */
    create2DArray(rows, cols, defaultValue) {
        let array = [];
        for (let i = 0; i < rows; i++) {
            array.push([]);
            for (let j = 0; j < cols; j++) {
                array[i][j] = defaultValue;
            }
        }
        return array;
    }

    /**
     * @description Generate the maze using depth-first search algorithm
     * @memberof Maze
     * @returns {void}
     */
    generate() {
        this.maze = this.create2DArray(this.height, this.width, 1);
        this.dfs(1, 1);
    }

    /**
     * @description The depth-first search algorithm
     * @memberof Maze
     * @returns {void}
     */
    dfs(x, y, depth = 0) {
        if (depth >= 10000) return; // prevent stack overflow (for large mazes

        let dir = this.directions.slice(); // get copy of directions
        this.maze[x][y] = 0;

        while (dir.length) {
            let randIndex = Math.floor(Math.random() * dir.length);
            let direction = dir.splice(randIndex, 1)[0];
            let nx = x + 2 * direction[0];
            let ny = y + 2 * direction[1];

            if (nx > 0 && nx < this.height - 1 && ny > 0 && ny < this.width - 1 && this.maze[nx][ny]) {
                this.maze[x + direction[0]][y + direction[1]] = 0;
                try {
                    this.dfs(nx, ny, depth + 1);
                } catch (e) {
                    console.log(e);
                }
            }
        }

        // Introduce some randomness
        let attemptedStart = [
                Math.floor(Math.random() * (this.height - 2)) + 1,
                Math.floor(Math.random() * (this.width - 2)) + 1,
            ],
            attemptedEnd = [
                Math.floor(Math.random() * (this.height - 2)) + 1,
                Math.floor(Math.random() * (this.width - 2)) + 1,
            ];

        while (this.maze[attemptedStart[0]][attemptedStart[1]]) {
            attemptedStart = [
                Math.floor(Math.random() * (this.height - 2)) + 1,
                Math.floor(Math.random() * (this.width - 2)) + 1,
            ];
        }

        while (this.maze[attemptedEnd[0]][attemptedEnd[1]]) {
            attemptedEnd = [
                Math.floor(Math.random() * (this.height - 2)) + 1,
                Math.floor(Math.random() * (this.width - 2)) + 1,
            ];
        }

        this.start = attemptedStart;
        this.end = attemptedEnd;
    }

    /**
     * @description Draw the maze
     * @memberof Maze
     * @returns {void}
     */
    draw() {
        let w = width / this.width;
        let h = height / this.height;
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                if (i == this.start[0] && j == this.start[1]) {
                    fill(0, 255, 0); // start is green
                } else if (i == this.end[0] && j == this.end[1]) {
                    fill(255, 0, 0); // end is red
                } else if (this.maze[i][j] === 1) {
                    fill(0); // wall is black
                } else if (this.maze[i][j] === 0) {
                    fill(32); // path is grey
                }
                noStroke();
                rect(j * w, i * h, w + 1, h + 1);
            }
        }
    }

    /**
     * @description Solves the maze using A* algorithm
     * @memberof Maze
     * @returns {Array}
     */
    solve() {
        let openList = [];
        let closedList = this.create2DArray(this.height, this.width, false);
        let cameFrom = {};
        
        let startKey = `${this.start[0]}-${this.start[1]}`;
        let endKey = `${this.end[0]}-${this.end[1]}`;
        
        openList.push(startKey);
        cameFrom[startKey] = null;

        let gScore = {};
        gScore[startKey] = 0;

        let fScore = {};
        fScore[startKey] = this.heuristic(this.start, this.end);

        while (openList.length) {
            let current = openList.reduce((a, b) => fScore[a] < fScore[b] ? a : b);

            if (current === endKey) {
                return this.reconstructPath(cameFrom, current);
            }

            openList.splice(openList.indexOf(current), 1);
            closedList[current] = true;

            for (let direction of this.directions) {
                let neighbour = [parseInt(current.split('-')[0]) + direction[0], parseInt(current.split('-')[1]) + direction[1]];
                let neighbourKey = `${neighbour[0]}-${neighbour[1]}`;

                if (neighbour[0] < 0 || neighbour[1] < 0 || neighbour[0] >= this.height || neighbour[1] >= this.width || 
                    this.maze[neighbour[0]][neighbour[1]] === 1 || closedList[neighbourKey]) {
                    continue;
                }

                let tentativeGScore = gScore[current] + 1;
                if (!openList.includes(neighbourKey)) {
                    openList.push(neighbourKey);
                } else if (tentativeGScore >= gScore[neighbourKey]) {
                    continue;
                }

                cameFrom[neighbourKey] = current;
                gScore[neighbourKey] = tentativeGScore;
                fScore[neighbourKey] = gScore[neighbourKey] + this.heuristic(neighbour, this.end);
            }
        }
        
        // If no solution was found, return an empty path
        return [];
    }

    /**
     * @description Heuristic for A* algorithm
     * @memberof Maze
     * @returns {number}
     */
    heuristic(start, end) {
        return Math.abs(start[0] - end[0]) + Math.abs(start[1] - end[1]);
    }

    /**
     * @description Reconstructs path after A* algorithm
     * @memberof Maze
     * @returns {Array}
     */
    reconstructPath(cameFrom, current) {
        let totalPath = [current];
        while (current !== null && current in cameFrom) {
            current = cameFrom[current];
            if(current !== null) {
                totalPath.unshift(current);
            }
        }
        return totalPath.map(step => step.split('-').map(Number));
    }
}
