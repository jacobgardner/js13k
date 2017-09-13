import { random, randomPop } from './random';
import Game from './game';
import Node from './node';
import { Vec2 } from './math';

interface GridCoord {
    [key: string]: Node;
}

export class Grid {
    nodes: GridCoord = {};

    constructor(public width: number, public height: number) {}

    get(vec: Vec2): Node | null {
        vec = vec.clone();
        vec.x = Math.floor(vec.x);
        vec.y = Math.floor(vec.y);

        const coord = [vec.x, vec.y].toString();

        if (vec.x >= this.width || vec.y >= this.height || vec.x < 0 || vec.y < 0) {
            return null;
        }

        let node: Node = this.nodes[coord] as Node;
        if (!node) {
            node = this.nodes[coord] = new Node(vec.x, vec.y);
        }

        return node;
    }

    draw(game: Game, isMinimap: boolean) {
        game.mazeShaders.use();
        const renderer = game.renderer;
        const gl = renderer.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, renderer.squareBuffer);
        gl.vertexAttribPointer(
            game.mazeShaders.vertPos,
            2,
            gl.FLOAT,
            false,
            0,
            0
        );

        gl.uniform1i(game.mazeShaders.isMinimap, isMinimap ? 1 : 0);

        for (const key in this.nodes) {
            const node = this.nodes[key];
            node.draw(game);
        }
    }
}

const ADJACENT = [new Vec2(-1, 0), new Vec2(1, 0), new Vec2(0, -1), new Vec2(0, 1)];

export default function(width: number, height: number): [Grid, Node, Node] {
    const grid: Grid = new Grid(width, height);

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const nodePosition = new Vec2(x, y);

            const node = grid.get(nodePosition) as Node;

            for (const offset of ADJACENT) {
                const sibling = grid.get(nodePosition.add(offset));
                if (sibling) {
                    node.untouched.push(sibling);
                }
            }
        }
    }

    const start = grid.get(new Vec2(random(0, width), random(0, height))) as Node;
    const open: Node[] = [start];

    let end = start;

    while (open.length) {
        const node = open[0];
        node.touched = true;
        if (!node.untouched.length) {
            open.shift();
            continue;
        }

        const sibling = randomPop(node.untouched);
        if (sibling.touched) {
            continue;
        }
        sibling.untouched.splice(sibling.untouched.indexOf(node), 1);
        sibling.children.push(node);
        sibling.distance = node.distance + 1;
        if (sibling.distance > end.distance) {
            end = sibling;
        }
        node.children.push(sibling);
        sibling.touched = true;
        open.splice(0, 0, sibling);
    }

    return [grid, start, end];
}
