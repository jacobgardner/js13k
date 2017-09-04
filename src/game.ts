import buildGrid, { Grid, Node } from './grid';
import { SIZE_X, SIZE_Y, TRANSITION, PLAYER_SPEED } from './config';
import Renderer, { Program } from './renderer';
import { vertex, hallFrag } from './shaders/shaders';
import { setMatrix } from './lib';
import { buildEntities, Entity, Enemy } from './entity';
import { random } from './random';
import Player from './player';

// @if DEBUG
import { nodeToChar, drawMatrix } from './debug';
// @endif

const LEFT = 1;
const RIGHT = 2;
const UP = 4;
const DOWN = 8;

interface Map<T> {
    [key: string]: T;
}

function classifyNode(node: Node): number {
    let number = 0;
    for (const kid of node.children) {
        const x = node.position[0] - kid.position[0];
        const y = node.position[1] - kid.position[1];
        if (x === 1) {
            number += LEFT;
        } else if (x === -1) {
            number += RIGHT;
        } else if (y === 1) {
            number += UP;
        } else {
            number += DOWN;
        }
    }

    return number;
}

export default class Game {
    grid: Grid;
    start: Node;
    end: Node;
    program: Program;
    entities: Entity[] = [];
    player: Player;
    downMap: Map<number> = {};

    constructor(public renderer: Renderer) {
        [this.grid, this.start, this.end] = buildGrid();
        this.program = new Program(renderer, vertex, hallFrag);

        for (const key in this.grid) {
            const node = this.grid[key] as Node;
            if (node !== this.start && node !== this.end) {
                // we can pass in difficulty or whatever here
                const entityCount = random(0, node.distance);
                for (let i = 0; i < entityCount; i += 1) {
                    const enemy = new Enemy(
                        node.position[0] + Math.random(),
                        node.position[0] + Math.random()
                    );
                    this.entities.push(enemy);
                }
            }
        }

        onkeydown = evt => {
            this.downMap[evt.key.toLowerCase()] = 1;
        };

        onkeyup = evt => {
            this.downMap[evt.key.toLowerCase()] = 0;
        };

        this.player = new Player(renderer, this);
    }

    processInput() {
        const { player, grid, downMap } = this;
        let [x, y] = [player.x, player.y];

        const px = player.x;
        const py = player.y;
        const current = grid.get(Math.floor(px), Math.floor(py)) as Node;
        const buffer = 0.3;

        function update(x: number, y: number, cx: number, cy: number) {
            const node = grid.get(Math.floor(cx), Math.floor(cy)) as Node;
            if (current.children.indexOf(node) !== -1) {
                player.x = x;
                player.y = y;
                return true;
            }
            return false;
        }

        if (downMap.w) {
            y -= PLAYER_SPEED;
        }

        if (downMap.s) {
            y += PLAYER_SPEED;
        }

        if (downMap.a) {
            x -= PLAYER_SPEED;
        }

        if (downMap.d) {
            x += PLAYER_SPEED;
        }

        if (Math.floor(x) !== Math.floor(px)) {
            const node = grid.get(Math.floor(x), Math.floor(py)) as Node;
            if (current.children.indexOf(node) !== -1) {
                player.x = x;
            }
        } else {
            player.x = x;
        }

        if (Math.floor(y) !== Math.floor(py)) {
            const node = grid.get(Math.floor(px), Math.floor(y)) as Node;
            if (current.children.indexOf(node) !== -1) {
                player.y = y;
            }
        } else {
            player.y = y;
        }

        current.touched = false;

        if (!current.time) {
            current.time = Date.now();
        }
    }

    draw() {
        this.processInput();

        const SCALE = 12;
        const player = this.player;
        // prettier-ignore
        this.renderer.camera = new Float32Array([
            SCALE,             0,                 0, 0,
            0,                 SCALE,             0, 0,
            0,                 0,                 1, 0,
            -SCALE * player.x, -SCALE * player.y, 1, 1
        ]);

        this.program.use();
        const gl = this.renderer.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.renderer.squareBuffer);
        gl.vertexAttribPointer(this.program.vertPos, 2, gl.FLOAT, false, 0, 0);

        for (let x = 0; x < SIZE_X; x += 1) {
            for (let y = 0; y < SIZE_Y; y += 1) {
                this.renderer.modelMat = setMatrix(x, y);
                this.renderer.setMatrices();

                const node = this.grid.get(x, y) as Node;
                const classified = classifyNode(node);
                gl.uniform1i(
                    this.program.squareState,
                    node === this.start
                        ? 0
                        : node === this.end ? 1 : node.touched ? 2 : 3
                );

                let t = !node.time ? 0 : (Date.now() - node.time) / TRANSITION;
                if (t > 1) {
                    t = 1;
                }

                gl.uniform1f(this.program.t, t);
                gl.uniform4iv(this.program.squareType, [
                    LEFT & classified,
                    UP & classified,
                    RIGHT & classified,
                    DOWN & classified
                ]);
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            }
        }

        const removedEntities: Entity[] = [];

        for (const entity of this.entities) {
            const alive = entity.simulate(this);
            if (alive) {
                entity.draw();
            }
        }

        for (const entity of removedEntities) {
            this.entities.splice(this.entities.indexOf(entity), 1);
        }

        player.draw();
    }

    // @if DEBUG
    toString() {
        const lines = [];
        for (let y = 0; y < SIZE_Y; y++) {
            const line = [];
            for (let x = 0; x < SIZE_X; x++) {
                line.push(this.grid[[x, y].toString()]);
            }

            lines.push(
                line
                    .map(
                        n =>
                            n === this.start
                                ? '%cS%c'
                                : n === this.end
                                  ? '%cE%c'
                                  : nodeToChar(n as Node)
                    )
                    .join('')
            );
        }

        return lines.join('\n');
    }
    // @endif
}
