import PhysicsEngine from './physics';
import Renderer from './renderer';

// How often the physics loop will fire.
const TIMESTEP = 1/60;

export default class Game {
    constructor() {
        this.physicsEngine = new PhysicsEngine();
        this.renderer = new Renderer();
        this.state = {};
        this.prevState = {};

        this.physicsDelta = TIMESTEP; // We could make this 0 for pause, or decrease for slow motion.
        this.play = false;

        this.drawFrame = this.drawFrame.bind(this);
        this.physicsLoop = this.physicsLoop.bind(this);
    }

    startLoop() {
        this.play = true;
        this.drawFrame();
        this.physicsLoop();
    }

    stopLoop() {
        this.play = false;
    }

    physicsLoop() {
        const start = performance.now();

        this.prevState = this.state;
        this.state = this.physicsEngine.doStuff(this.prevState, this.physicsDelta) 

        const total = performance.now() - start;

        this.play && window.setTimeout(physicsLoop, Math.max(TIMESTEP - total, 0));
    }

    drawFrame() {

        const delta = 0; // <- We'd want to make this the time that we are between physics processes   
        Renderer.draw(this.prevState, this.state, delta)

        this.play && window.requestAnimationFrame(this.drawFrame);
    }
}