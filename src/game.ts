import buildGrid, { Grid } from './grid';
import Node from './node';
import { SIZE_X, SIZE_Y, RENDER_AOE } from './config';
import Renderer, { Program } from './renderer';
import { vertex, hallFrag, enemyFrag } from './shaders/shaders';
import { Entity, Enemy } from './entity';
import { random } from './random';
import Player from './player';
import { state } from './globals';

// @if DEBUG
import { nodeToChar } from './debug';
// @endif

interface Map<T> {
    [key: string]: T;
}

export default class Game {
    grid: Grid;
    start: Node;
    end: Node;
    entities: Entity[] = [];
    player: Player;
    downMap: Map<number> = {};

    mazeShaders: Program;
    enemyShaders: Program;

    constructor(public renderer: Renderer) {
        [this.grid, this.start, this.end] = buildGrid();
        this.mazeShaders = new Program(renderer, vertex, hallFrag);
        this.enemyShaders = new Program(renderer, vertex, enemyFrag);

        for (const key in this.grid) {
            const node = this.grid[key] as Node;
            if (node !== this.start && node !== this.end) {
                // we can pass in difficulty or whatever here
                const entityCount = random(0, 3);
                for (let i = 0; i < entityCount; i += 1) {
                    const enemy = new Enemy(
                        node.position[0] + 0.2 + Math.random() * 0.6,
                        node.position[1] + 0.2 + Math.random() * 0.6
                    );
                    this.entities.push(enemy);
                }
            }
        }

        console.log(this.entities);

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

        function update(x: number, y: number, dx: number, dy: number) {
            const node = grid.get(Math.floor(x), Math.floor(y)) as Node;
            if (current.children.indexOf(node) !== -1) {
                player.x = dx;
                player.y = dy;
                return true;
            }
            return false;
        }

        if (downMap.w) {
            y -= player.speed * state.delta;
        }

        if (downMap.s) {
            y += player.speed * state.delta;
        }

        if (downMap.a) {
            x -= player.speed * state.delta;
        }

        if (downMap.d) {
            x += player.speed * state.delta;
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
        state.lastFrame = state.lastFrame + state.delta * 1000;
        state.delta = (Date.now() - state.lastFrame) / 1000;
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

        const gl = this.renderer.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.renderer.squareBuffer);
        gl.vertexAttribPointer(
            this.mazeShaders.vertPos,
            2,
            gl.FLOAT,
            false,
            0,
            0
        );

        this.grid.draw(this);

        const removedEntities: Entity[] = [];
        for (const entity of this.entities) {
            if (
                Math.abs(player.x - entity.x) > RENDER_AOE ||
                Math.abs(player.y - entity.y) > RENDER_AOE
            ) {
                continue;
            }

            const alive = entity.simulate(this);
            if (alive) {
                entity.draw(this);
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
