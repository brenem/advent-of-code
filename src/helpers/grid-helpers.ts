import { Direction } from '../models/directions';
import { Point } from '../models/point';

export const move = (location: Point, direction: Direction): Point => {
    switch (direction) {
        case Direction.Up:
            return { x: location.x, y: location.y - 1 };
        case Direction.Down:
            return { x: location.x, y: location.y + 1 };
        case Direction.Right:
            return { x: location.x + 1, y: location.y };
        case Direction.Left:
            return { x: location.x - 1, y: location.y };
        case Direction.UpLeft:
            return { x: location.x - 1, y: location.y - 1 };
        case Direction.UpRight:
            return { x: location.x + 1, y: location.y - 1 };
        case Direction.DownLeft:
            return { x: location.x - 1, y: location.y + 1 };
        case Direction.DownRight:
            return { x: location.x + 1, y: location.y + 1 };
        default:
            throw new Error('Invalid direction');
    }
};

export const findInSet = <T>(set: Set<T>, pred: (item: T) => boolean): T | undefined => {
    for (const item of set) {
        if (pred(item)) {
            return item;
        }
    }

    return undefined;
};
