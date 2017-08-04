import PhysicsEngine from './physics';
import Renderer from './renderer';

const TIMESTEP = 1/60;
let DELTA = 1/60; // We could make this 0 for pause, or decrease for slow motion.

export default class Game {
    constructor() {
        this.physicsEngine = new PhysicsEngine();
        this.renderer = new Renderer();
        this.state = {};
        this.prevState = {};

        this.drawFrame = this.drawFrame.bind(this);
        this.physicsLoop = this.physicsLoop.bind(this);
    }

    startLoop() {
        this.drawFrame();
        this.physicsLoop();
    }

    physicsLoop() {
        const start = performance.now();

        this.prevState = this.state;
        this.state = this.physicsEngine.doStuff(this.prevState, DELTA) 

        const total = performance.now() - start;

        window.setTimeout(physicsLoop, Math.max(TIMESTEP - total, 0));
    }

    drawFrame() {

        const delta = 0; // <- We'd want to make this the time that we are between physics processes   
        Renderer.draw(this.prevState, this.state, delta)

        window.requestAnimationFrame(this.drawFrame);
    }
}