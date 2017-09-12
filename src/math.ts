export class Vec2 {
    constructor(public x: number = 0, public y: number = 0) {}

    subtract(rhs: Vec2 | number) {
        if (rhs instanceof Vec2) {
            return new Vec2(this.x - rhs.x, this.y - rhs.y);
        } else {
            return new Vec2(this.x - rhs, this.y - rhs);
        }
    }

    add(rhs: Vec2 | number) {
        if (rhs instanceof Vec2) {
            return new Vec2(this.x + rhs.x, this.y + rhs.y);
        } else {
            return new Vec2(this.x + rhs, this.y + rhs);
        }
    }

    multiply(rhs: number | Vec2) {
        if (rhs instanceof Vec2) {
            return new Vec2(this.x * rhs.x, this.y * rhs.y);
        } else {
            return new Vec2(this.x * rhs, this.y * rhs);
        }
    }

    dist2(rhs?: Vec2) {
        const diff = rhs ? this.subtract(rhs) : this;

        return diff.x * diff.x + diff.y * diff.y;
    }

    dist(rhs?: Vec2) {
        return Math.sqrt(this.dist2(rhs));
    }

    normalize(): Vec2 {
        const length = this.dist();
        return new Vec2(this.x / length, this.y / length);
    }
}
