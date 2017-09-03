import { floor } from './globals';

let seed = Math.floor(Math.random() * 10000);

export function random(min: number, max: number) {
    const x = Math.sin(seed++) * 10000;
    return floor((x - floor(x)) * (max - min) + min);
}

export function randomPop<T>(list: T[]): T {
    return list.splice(random(0, list.length), 1)[0];
}

export function shuffle<T>(list: T[]): T[] {
    const r = random(0, list.length);
    for (let i = 0; i < list.length; i += 1) {
        list.push(list.splice(r, 1)[0]);
    }

    return list;
}
