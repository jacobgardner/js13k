
import Renderer, { Program } from './renderer';
import Maze from './maze';

export default class Player {
    x: number;
    y: number;
    program: Program;

    constructor(renderer: Renderer, maze: Maze) {
        [this.x, this.y] = [maze.start.position[0] + 0.5, maze.start.position[1] + 0.5];

    }

    draw() {

    }
}