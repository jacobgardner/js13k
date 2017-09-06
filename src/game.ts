import buildGrid, { Grid } from './grid';
import Node from './node';
import { SIZE_X, SIZE_Y, RENDER_AOE, MAX_TOUCH_DISTANCE } from './config';
import Renderer, { Program } from './renderer';
import {
    vertex,
    hallFrag,
    enemyFrag,
    bulletFrag,
    shadowFrag,
    flashlightFrag,
    indicatorFrag
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
    entities: Entity[];
    pendingEntities: Entity[];
    player: Player;
    downMap: Map<number> = {};
    startTime: number = Date.now();

    shadowBuffer: WebGLBuffer;
    shadowCount: number = 0;

    mazeShaders: Program;
    enemyShaders: Program;
    bulletShaders: Program;
    flashlightShaders: Program;
    shadowShaders: Program;
    indicatorShaders: Program;

    startVector: [number, number] = [0, 0];
    currentVector: [number, number] = [0, 0];

    constructor(public renderer: Renderer) {
        this.mazeShaders = new Program(renderer, vertex, hallFrag);
        this.enemyShaders = new Program(renderer, vertex, enemyFrag);
        this.bulletShaders = new Program(renderer, vertex, bulletFrag);
        this.shadowShaders = new Program(renderer, vertex, shadowFrag);
        this.flashlightShaders = new Program(renderer, vertex, flashlightFrag);
        this.indicatorShaders = new Program(renderer, vertex, indicatorFrag);

        this.player = new Player(renderer);

        this.buildWorld();

        onkeydown = evt => {
            this.downMap[evt.key.toLowerCase()] = 1;
        };

        onkeyup = evt => {
            this.downMap[evt.key.toLowerCase()] = 0;
        };

        window.ontouchstart = evt => {
            evt.preventDefault();
            const root = (evt.targetTouches && evt.targetTouches[0]) || evt;
            this.startVector = [root.clientX, root.clientY];
        };

        window.ontouchend = evt => {
            evt.preventDefault();
            this.startVector = [0, 0];
        };

        window.ontouchmove = evt => {
            evt.preventDefault();
            const root = (evt.targetTouches && evt.targetTouches[0]) || evt;
            this.currentVector = [root.clientX, root.clientY];
        };

        onmouseup = ontouchend as any;
        onmousedown = ontouchstart as any;
        onmousemove = ontouchmove as any;
    }

    buildWorld() {
        this.entities = [];
        this.pendingEntities = [];
        [this.grid, this.start, this.end] = buildGrid();

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

        this.player.start(this.start.position[0], this.start.position[1]);
    }

    processInput() {
        const { player, grid, downMap } = this;
        let [x, y] = [player.x, player.y];

        const px = player.x;
        const py = player.y;
        const current = grid.get(Math.floor(px), Math.floor(py)) as Node;

        if (!this.startVector[0] && !this.startVector[1]) {
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
        } else {
            let actualVector: [number, number] = [this.currentVector[0] - this.startVector[0], this.currentVector[1] - this.startVector[1]];

            if (actualVector[0] * actualVector[0] > MAX_TOUCH_DISTANCE * MAX_TOUCH_DISTANCE) {
                actualVector = normalize(actualVector);
            } else {
                actualVector = [actualVector[0] / MAX_TOUCH_DISTANCE, actualVector[1] / MAX_TOUCH_DISTANCE];
            }

            x += actualVector[0] * player.speed * state.delta;
            y += actualVector[1] * player.speed * state.delta;

            // console.log(actualVector);
        }

        // x = Math.round(x * 100) / 100;
        // y = Math.round(y * 100) / 100;

        let xoffset = 0.01;
        let yoffset = xoffset;
        if (px % 1 < 0.5) {
            xoffset *= -1;
        }

        if (py % 1 < 0.5) {
            yoffset *= -1;
        }

        if (current.passable(x + xoffset, py + yoffset)) {
            player.x = x;
        }

        if (current.passable(px + xoffset, y + yoffset)) {
            player.y = y;
        }

        current.touched = false;

        if (!current.time) {
            current.time = Date.now();
        }
    }

    buildShadows() {
        let points: number[] = [];
        const shadowScale = 500;
        for (const key in this.grid) {
            const node = this.grid[key] as Node;
            const [nx, ny] = node.position;
            const [px, py] = [this.player.x, this.player.y];
            const x = px - nx;
            const y = py - ny;

            function buildShadow(x: number, y: number, dx: number, dy: number) {
                const ray1 = normalize([x - px, y - py]);
                const ray2 = normalize([dx - px, dy - py]);

                const p1 = [
                    x + ray1[0] * shadowScale,
                    y + ray1[1] * shadowScale
                ];
                const p2 = [
                    dx + ray2[0] * shadowScale,
                    dy + ray2[1] * shadowScale
                ];

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
        this.renderer.modelMat = setMatrix(
            this.player.x - 1,
            this.player.y - 1,
            2
        );
        this.renderer.setMatrices();
        gl.uniform1f(this.flashlightShaders.hp, this.player.hp);
        gl.uniform1f(
            this.flashlightShaders.t,
            (Date.now() - this.startTime) / 100
        );
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
            gl.uniform1f(this.shadowShaders.hp, this.player.hp);
            gl.drawArrays(gl.TRIANGLES, 0, this.shadowCount);
        }

        let exitVec: [number, number] = [
            this.end.position[0] + 0.5 - this.player.x,
            this.end.position[1] + 0.5 - this.player.y
        ];

        const maxDist = 0.75;
        if (
            exitVec[0] * exitVec[0] + exitVec[1] * exitVec[1] >
            maxDist * maxDist
        ) {
            exitVec = normalize(exitVec);
            // console.log(exitVec);
            exitVec = [exitVec[0] * maxDist, exitVec[1] * maxDist];
        }

        this.indicatorShaders.use();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.renderer.squareBuffer);
        gl.vertexAttribPointer(
            this.indicatorShaders.vertPos,
            2,
            gl.FLOAT,
            false,
            0,
            0
        );
        this.renderer.modelMat = setMatrix(
            player.x - 0.5 + exitVec[0],
            player.y - 0.5 + exitVec[1],
            1
        );
        this.renderer.setMatrices();

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        if (
            (player.hp < 0.01 && player.actualHP < 1) ||
            (player.hp >= 1.5 && player.actualHP > 1.5)
        ) {
            player.actualHP = 1;
            this.buildWorld();
        }

        const playerNode = this.grid.get(
            Math.floor(player.x),
            Math.floor(player.y)
        );
        if (playerNode === this.end) {
            player.actualHP = 1.8;
            this.entities = [];
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
