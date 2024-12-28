import { Grid, search } from '../../algorithms/astar';
import { Point } from '../../models/point';
import { PuzzleResult } from '../../models/puzzle-result';
import { Challenge } from '../challenge';

export class Day18 extends Challenge {
    async part1(input: string): Promise<PuzzleResult> {
        const points = this.dataLoader.readLines(input, (line) => ({
            x: parseInt(line.split(',')[0]),
            y: parseInt(line.split(',')[1])
        }));

        const shortestPath = this.findShortestPath(points, 1024, { width: 71, height: 71 });
        return shortestPath!.length - 1;
    }

    async part2(input: string): Promise<PuzzleResult> {
        const points = this.dataLoader.readLines(input, (line) => ({
            x: parseInt(line.split(',')[0]),
            y: parseInt(line.split(',')[1])
        }));

        let bytes = 1024;
        const gridSize = { width: 71, height: 71 };
        let shortestPath = this.findShortestPath(points, bytes, gridSize);

        while (shortestPath) {
            bytes++;
            shortestPath = this.findShortestPath(points, bytes, gridSize);
        }

        const failingCoordinate = points[bytes - 1];
        return `${failingCoordinate.x},${failingCoordinate.y}`;
    }

    private findShortestPath(
        allPoints: Point[],
        bytes: number,
        gridSize: { width: number; height: number }
    ): Point[] | undefined {
        const points: Point[] = allPoints.slice(0, bytes);

        const gridMaxWidth = gridSize.width;
        const gridMaxHeight = gridSize.height;
        const grid: Grid = Array.from({ length: gridMaxHeight }, () => Array.from({ length: gridMaxWidth }, () => 0));

        for (let row = 0; row < gridMaxHeight; row++) {
            for (let col = 0; col < gridMaxWidth; col++) {
                if (points.some((p) => p.x === col && p.y === row)) {
                    grid[row][col] = -1;
                }
            }
        }

        const start: Point = { x: 0, y: 0 };
        const end: Point = { x: gridMaxWidth - 1, y: gridMaxHeight - 1 };

        const shortestPath = search({
            cutCorners: false,
            diagonal: false,
            from: [start.x, start.y],
            to: [end.x, end.y],
            grid: grid
        })?.map<Point>((node) => ({ x: node[0], y: node[1] }));

        return shortestPath;
    }
}
