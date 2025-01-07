import { Point } from '../models/point';

export const isOutOfBounds = (grid: string[][], location: Point): boolean => {
    return location.x >= grid[0].length || location.y >= grid.length || location.x < 0 || location.y < 0;
};

export const groupBy = <T, K extends keyof T>(array: T[], key: K): Record<string, T[]> => {
    const result: Record<string, T[]> = {};

    array.forEach(item => {
        const groupKey = item[key] as unknown as string;
        
        if (!result[groupKey]) {
            result[groupKey] = [];
        }

        result[groupKey].push(item);
    });

    return result;
};