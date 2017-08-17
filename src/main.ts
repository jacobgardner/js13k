import {win} from './globals';
import {initGL} from './gl';

const gl = initGL();

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
}

win.requestAnimationFrame(render);
