import Game from './game';

export interface Entity {
    draw(): void;
    // Return false on remove
    simulate(game: Game): boolean;
}

export class Enemy implements Entity {
    constructor(public x: number, public y: number) {}

    draw() {}

    simulate() {
        return true;
    }
}

export function buildEntities(): Entity[] {
    return [];
}
