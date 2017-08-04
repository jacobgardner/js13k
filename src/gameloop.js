import drawFrame from './renderer';
import physicsLoop from './physics';

export default function gameLoop() {
    window.requestAnimationFrame(drawFrame);
    physicsLoop();
}