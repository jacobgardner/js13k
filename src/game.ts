import buildGrid, { Grid } from './grid';
import Node from './node';
import { SIZE_X, SIZE_Y, RENDER_AOE } from './config';
import Renderer, { Program } from './renderer';
import {
    vertex,
    hallFrag,
    enemyFrag,
    bulletFrag,
    shadowFrag,
    flashlightFrag
} from './shaders/shaders';
import { Entity, Enemy } from './entity';
import { random } from './random';
import Player from './player';
import { state } from './globals';
import { normalize, setMatrix } from './lib';

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
    pendingEntities: Entity[] = [];
    player: Player;
    downMap: Map<number> = {};

    shadowBuffer: WebGLBuffer;
    shadowCount: number = 0;

    mazeShaders: Program;
    enemyShaders: Program;
    bulletShaders: Program;
    flashlightShaders: Program;
    shadowShaders: Program;

    constructor(public renderer: Renderer) {
        [this.grid, this.start, this.end] = buildGrid();
        this.mazeShaders = new Program(renderer, vertex, hallFrag);
        this.enemyShaders = new Program(renderer, vertex, enemyFrag);
        this.bulletShaders = new Program(renderer, vertex, bulletFrag);
        this.shadowShaders = new Program(renderer, vertex, shadowFrag);
        this.flashlightShaders = new Program(renderer, vertex, flashlightFrag);

        for (const key in this.grid) {
            const node = this.grid[key] as Node;
            if (node !== this.start && node !== this.end) {
                // we can pass in difficulty or whatever here
                const entityCount = random(0, 2);
                for (let i = 0; i < entityCount; i += 1) {
                    const enemy = new Enemy(
                        node.position[0] + 0.2 + Math.random() * 0.6,
                        node.position[1] + 0.2 + Math.random() * 0.6
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

        // @if DEPLOY || DEBUG
        if (downMap.arrowup) {
            y -= player.speed * state.delta;
        }

        if (downMap.arrowdown) {
            y += player.speed * state.delta;
        }

        if (downMap.arrowleft) {
            x -= player.speed * state.delta;
        }

        if (downMap.arrowright) {
            x += player.speed * state.delta;
        }
        // @endif

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

        if (current.passable(x, py)) {
            player.x = x;
        }

        if (current.passable(px, y)) {
            player.y = y;
        }

        current.touched = false;

        if (!current.time) {
            current.time = Date.now();
        }
    }

    buildShadows() {
        let points: number[] = [];
        for (const key in this.grid) {
            const node = this.grid[key] as Node;
            const [nx, ny] = node.position;
            const [px, py] = [this.player.x, this.player.y];
            const x = px - nx;
            const y = py - ny;

            function buildShadow(x: number, y: number, dx: number, dy: number) {
                const ray1 = normalize([x - px, y - py]);
                const ray2 = normalize([dx - px, dy - py]);

                const p1 = [x + ray1[0] * 5, y + ray1[1] * 5];
                const p2 = [dx + ray2[0] * 5, dy + ray2[1] * 5];

                points = points.concat([x, y], p1, [dx, dy], p1, [dx, dy], p2);
            }

            // Use to build shadows
            if (x * x + y * y < 2 * 2) {
                if (!node.passable(nx, ny - 1)) {
                    // Bottom blocked
                    buildShadow(nx, ny, nx + 1, ny);
                }

                if (!node.passable(nx - 1, ny)) {
                    // left blocked
                    buildShadow(nx, ny, nx, ny + 1);
                }
            }
            // if (this.player.x * )
        }

        const { gl } = this.renderer;

        if (this.shadowBuffer) {
            gl.deleteBuffer(this.shadowBuffer);
        }
        this.shadowBuffer = gl.createBuffer() as WebGLBuffer;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.shadowBuffer);
        // console.log(points);
        // console.log(new Float32Array(points));
        const floatArray = new Float32Array(points);
        gl.bufferData(gl.ARRAY_BUFFER, floatArray, gl.STREAM_DRAW);

        this.shadowCount = floatArray.length / 2;
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

        this.buildShadows();

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
        this.entities = this.entities.concat(this.pendingEntities);
        this.pendingEntities = [];
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
            } else {
                removedEntities.push(entity);
            }
        }

        for (const entity of removedEntities) {
            this.entities.splice(this.entities.indexOf(entity), 1);
        }

        player.simulate();
        player.draw();

        this.flashlightShaders.use();
        this.renderer.modelMat = setMatrix(this.player.x - 1, this.player.y - 1, 2);
        this.renderer.setMatrices();
        gl.uniform1f(this.flashlightShaders.t, this.player.hp);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);


        if (this.shadowCount) {
            this.shadowShaders.use();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.shadowBuffer);
            gl.vertexAttribPointer(
                this.mazeShaders.vertPos,
                2,
                gl.FLOAT,
                false,
                0,
                0
            );
            this.renderer.modelMat = setMatrix(0, 0, 1);
            this.renderer.setMatrices();
            gl.drawArrays(gl.TRIANGLES, 0, this.shadowCount);
        }
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
