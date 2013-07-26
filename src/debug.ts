// @if DEBUG
import Node from './node';

const LEFT = 1;
const RIGHT = 2;
const UP = 4;
const DOWN = 8;

export function nodeToChar(node: Node): string {
    let directions = 0;

    const DIRECTIONS = {
        0: ' ',
        [LEFT]: '\u2561',
        [RIGHT]: '\u255E',
        [UP]: '\u2568',
        [DOWN]: '\u2565',

        [RIGHT + DOWN]: '\u2554',
        [LEFT + RIGHT]: '\u2550',
        [RIGHT + UP]: '\u255A',

        [LEFT + UP]: '\u255D',
        [LEFT + DOWN]: '\u2557',

        [UP + DOWN]: '\u2551',

        [UP + DOWN + RIGHT]: '\u2560',
        [UP + DOWN + LEFT]: '\u2563',
        [LEFT + DOWN + RIGHT]: '\u2566',
        [LEFT + UP + RIGHT]: '\u2569',

        [LEFT + UP + RIGHT + DOWN]: '\u256C'
    };

    for (const kid of node.children) {
        const x = node.position.x - kid.position.x;
        const y = node.position.y - kid.position.y;
        if (x === 1) {
            directions += LEFT;
        } else if (x === -1) {
            directions += RIGHT;
        } else if (y === 1) {
            directions += UP;
        } else {
            directions += DOWN;
        }
    }

    return DIRECTIONS[directions];
}

export function drawMatrix(array: Float32Array) {
    const lines = [];
    for (let y = 0; y < 4; y += 1) {
        lines.push(array.slice(y * 4, (y + 1) * 4).join(' '));
    }

    console.log(lines.join('\n'));
}
// @endif
