export function range(max: number, fn: (idx: number) => void) {
    for (let i = 0; i < max; i += 1) {
        fn(i);
    }
}

export function setMatrix(
    x: number,
    y: number,
    scale: number = 1,
    angle: number = 0
) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    // prettier-ignore
    return new Float32Array([
        c * scale, s * scale, 0, 0,
        -s * scale, c * scale, 0, 0,
        0, 0, 1, 0,
        x, y, 0, 1
    ]);
}

export function normalize(vector: [number, number]): [number, number] {
    const [x, y] = vector;
    const length = Math.sqrt(x * x + y * y);
    return [x / length, y / length];
}