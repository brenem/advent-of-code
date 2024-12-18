import { Direction } from '../models/direction';
import { Point } from '../models/point';

export const move = (location: Point, direction: Direction): Point => {
    switch (direction) {
        case Direction.North:
            return { x: location.x, y: location.y - 1 };
        case Direction.South:
            return { x: location.x, y: location.y + 1 };
        case Direction.East:
            return { x: location.x + 1, y: location.y };
        case Direction.West:
            return { x: location.x - 1, y: location.y };
        case Direction.NorthWest:
            return { x: location.x - 1, y: location.y - 1 };
        case Direction.NorthEast:
            return { x: location.x + 1, y: location.y - 1 };
        case Direction.SouthWest:
            return { x: location.x - 1, y: location.y + 1 };
        case Direction.SouthEast:
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
