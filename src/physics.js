
const TIMESTEP = 1/60;
let DELTA = 1/60; // We could make this 0 for pause, or decrease for slow motion.

export default function physicsLoop() {
    const start = performance.now();

    // DO THE PHYSICS
    for (let i = 0; i < 65000; i += 1) {

    }

    const total = performance.now() - start;
    console.log(total);

    window.setTimeout(physicsLoop, Math.max(TIMESTEP - total, 0));
} 