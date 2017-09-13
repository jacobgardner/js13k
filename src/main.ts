import Game from './game';
import { win, doc } from './globals';
import Renderer from './renderer';

import Song from './audio/song';

const renderer = new Renderer();

const game = new Game(renderer);

import * as dan from './music/cartoonGraveyard';
const song = new Song(dan.channels, dan.tpb, dan.bpm, dan.bpb);
song.play();

// @if DEBUG
console.log(
    '%c' + game.toString(),
    'font-size: 14px;',
    'font-size: 14px;color: #009900; font-weight: bolder;',
    'font-size: 14px;color: #000000; font-weight: normal;',
    'font-size: 14px;color: #990000; font-weight: bolder;',
    'font-size: 14px;color: #000000; font-weight: normal'
);
// @endif

function render() {
    const gl = renderer.gl;
    gl.clear(gl.COLOR_BUFFER_BIT);

    game.draw();

    win.requestAnimationFrame(render);
}

render();
// win.requestAnimationFrame(render);
