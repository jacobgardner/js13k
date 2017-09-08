import { random, randomPop } from './random';
import Game from './game';
import Node from './node';

interface GridCoord {
    [key: string]: Node;
}

export class Grid {
    nodes: GridCoord = {};

    constructor(public width: number, public height: number) {}

    get(x: number, y: number): Node | null {
        // @if DEBUG
        if (x % 1 !== 0 || y % 1 !== 0) {
            throw new Error('Input must be integer');
        }
        // @endif
        const coord = [x, y].toString();

        if (x >= this.width || y >= this.height || x < 0 || y < 0) {
            return null;
        }

        let node: Node = this.nodes[coord] as Node;
        if (!node) {
            node = this.nodes[coord] = new Node(x, y);
        }

        return node;
    }

    draw(game: Game) {
        game.mazeShaders.use();
        for (const key in this.nodes) {
            const node = this.nodes[key];
            node.draw(game);
        }
    }
}

export default function(width: number, height: number): [Grid, Node, Node] {
    const grid: Grid = new Grid(width, height);

    const adjacent = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const node = grid.get(x, y) as Node;

            for (const offset of adjacent) {
                const sibling = grid.get(x + offset[0], y + offset[1]);
                if (sibling) {
                    node.untouched.push(sibling);
                }
            }
        }
    }

    const start = grid.get(random(0, width), random(0, height)) as Node;
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
