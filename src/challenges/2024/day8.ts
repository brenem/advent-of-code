import { Point } from '../../models/point';
import { Challenge } from '../challenge';

interface PointPair {
    a: Point;
    b: Point;
}

export class Day8 extends Challenge {
    async part1(input: string): Promise<number> {
        const grid = this.dataLoader.readLines(input, (line) => line.split(''));
        const antennas = this.findAntennas(grid);

        const antinodes: Point[] = [];
        for (const antenna of Object.keys(antennas)) {
            const locations = antennas[antenna];
            const pairs = this.findPointPairs(locations);
            const foundAntinodes = this.findAntinodes(pairs, grid);
            const cleaned = this.clean(foundAntinodes, Object.keys(antennas), grid);
            antinodes.push(...cleaned);
        }

        const distinct = this.distinctPoints(antinodes);
        return distinct.length;
    }

    async part2(input: string): Promise<number> {
        const grid = this.dataLoader.readLines(input, (line) => line.split(''));
        const antennas = this.findAntennas(grid);

        const antinodes: Point[] = [];
        for (const antenna of Object.keys(antennas)) {
            const locations = antennas[antenna];
            const pairs = this.findPointPairs(locations);
            const foundAntinodes = this.findAllAntinodes(pairs, grid);
            // const cleaned = this.clean(antinodePairs, Object.keys(antennas), grid);
            antinodes.push(...foundAntinodes);
        }

        const distinct = this.distinctPoints(antinodes);
        distinct.sort((a, b) => a.y - b.y || a.x - b.x);

        const gridCopy = grid.map((row) => [...row]);
        distinct.forEach((antinode) => {
            gridCopy[antinode.y][antinode.x] = '#';
        });
        this.logger.log(gridCopy.map((row) => row.join('')).join('\n'));

        return distinct.length;
    }

    private findAntennas(grid: string[][]): { [key: string]: Point[] } {
        const antennas: { [key: string]: Point[] } = {};
        for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid[row].length; col++) {
                const antenna = grid[row][col];
                if (antenna !== '.') {
                    if (!antennas[antenna]) {
                        antennas[antenna] = [{ x: col, y: row }];
                    } else {
                        antennas[antenna].push({ x: col, y: row });
                    }
                }
            }
        }

        return antennas;
    }

    private findPointPairs(points: Point[]): PointPair[] {
        const pairs: Set<PointPair> = new Set<PointPair>();

        for (let i = 0; i < points.length; i++) {
            for (let j = i + 1; j < points.length; j++) {
                const pair = { a: points[i], b: points[j] };
                pairs.add(pair);
            }
        }

        return [...pairs];
    }

    private findAntinodes(pairs: PointPair[], grid: string[][]): Point[] {
        const antinodes: Point[] = [];

        for (let i = 0; i < pairs.length; i++) {
            const slope = { x: pairs[i].b.x - pairs[i].a.x, y: pairs[i].b.y - pairs[i].a.y };
            const pointAAntinode1: Point = { x: pairs[i].a.x + slope.x, y: pairs[i].a.y + slope.y };
            const pointAAntinode2: Point = { x: pairs[i].a.x - slope.x, y: pairs[i].a.y - slope.y };
            const pointBAntinode1: Point = { x: pairs[i].b.x + slope.x, y: pairs[i].b.y + slope.y };
            const pointBAntinode2: Point = { x: pairs[i].b.x - slope.x, y: pairs[i].b.y - slope.y };

            if (this.pointsEqual(pointAAntinode1, pairs[i].b)) {
                antinodes.push(pointAAntinode2);
            } else {
                antinodes.push(pointAAntinode1);
            }

            if (this.pointsEqual(pointBAntinode1, pairs[i].a)) {
                antinodes.push(pointBAntinode2);
            } else {
                antinodes.push(pointBAntinode1);
            }
        }

        return antinodes;
    }

    private findAllAntinodes(pairs: PointPair[], grid: string[][]): Point[] {
        const antinodes: Point[] = [];

        for (let i = 0; i < pairs.length; i++) {
            let pair = {...pairs[i]};
            const slope = { x: pair.b.x - pair.a.x, y: pair.b.y - pair.a.y };

            // order the pair by y
            if (pair.a.y < pair.b.y) {
                pair = { a: pair.b, b: pair.a };
            }

            // find all the antinodes along the slope
            let antinode = { x: pair.a.x, y: pair.a.y };
            while (this.isPointInGrid(antinode, grid)) {
                antinodes.push(antinode);
                antinode = { x: antinode.x + slope.x, y: antinode.y + slope.y };
            }

            antinode = { x: pair.a.x - slope.x, y: pair.a.y - slope.y };
            while (this.isPointInGrid(antinode, grid)) {
                antinodes.push(antinode);
                antinode = { x: antinode.x - slope.x, y: antinode.y - slope.y };
            }
        }

        return antinodes;
    }

    private pointsEqual(a: Point, b: Point): boolean {
        return a.x === b.x && a.y === b.y;
    }

    private clean(antinodes: Point[], antennas: string[], grid: string[][]): Point[] {
        const cleaned: Point[] = [];

        for (const antinode of antinodes) {
            if (this.isPointInGrid(antinode, grid)) {
                cleaned.push(antinode);
            }
        }

        return cleaned;
    }

    private isPointInGrid(point: Point, grid: string[][]): boolean {
        return !!grid[point.y] && !!grid[point.y][point.x];
    }

    private distinctPoints(points: Point[]): Point[] {
        const unique: Point[] = [];
        points.forEach((point) => {
            if (!unique.some((p) => p.x === point.x && p.y === point.y)) {
                unique.push(point);
            }
        });

        return unique;
    }
}
