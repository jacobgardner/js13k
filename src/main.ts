import { win, doc } from './globals';
import { initGL } from './gl';
import Renderer from './renderer';

import Maze from './maze';
import { SIZE_X, SIZE_Y } from './config';

// Intentionally mispelled for the extra byte!
doc.title = 'Lst';
const renderer = new Renderer();
// const gl = initGL();

const m = new Maze(renderer);

// @if DEBUG
console.log(
    '%c' + m.toString(),
    'font-size: 14px;',
    'font-size: 14px;color: #009900; font-weight: bolder;',
    'font-size: 14px;color: #000000; font-weight: normal;',
    'font-size: 14px;color: #990000; font-weight: bolder;',
    'font-size: 14px;color: #000000; font-weight: normal'
);
// @endif

// This doesn't work because imports are hoisted....
//  probably should build these files as a separate step from glslx (via gulp-shadify)
//  and then iterate through them.

function render() {
    const gl = renderer.gl;
    gl.clear(gl.COLOR_BUFFER_BIT);

    m.draw();

    win.requestAnimationFrame(render);
}

win.requestAnimationFrame(render);
