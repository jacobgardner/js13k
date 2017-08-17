import {win, doc} from './globals';
import {initGL} from './gl';

// Intentionally mispelled for the extra byte!
doc.title = 'Lst';
const gl = initGL();

// This doesn't work because imports are hoisted....
//  probably should build these files as a separate step from glslx (via gulp-shadify)
//  and then iterate through them.

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
}

win.requestAnimationFrame(render);
