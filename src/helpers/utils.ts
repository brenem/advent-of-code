import { Point } from '../models/point';

export const isOutOfBounds = (grid: string[][], location: Point): boolean => {
    return location.x >= grid[0].length || location.y >= grid.length || location.x < 0 || location.y < 0;
};
