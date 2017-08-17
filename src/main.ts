import poop from './lib';
(() => {

const canvas = document.getElementById('canvas') as HTMLCanvasElement;

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

const gl = canvas.getContext('webgl');

poop();


})()
