export function lerp(start: number, end: number, t: number) {
    return start + t * (end - start);
}

export function logarithmicProgression(t: number) {
    return Math.floor(Math.log2(t + 1) * 4 + 2);
}