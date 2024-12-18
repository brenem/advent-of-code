import { kill } from 'process';
import { Point } from '../../models/point';
import { Queue } from '../../models/queue';
import { Challenge } from '../challenge';

export class Day10 extends Challenge {
    async part1(input: string): Promise<number | bigint> {
        const trailMap = this.dataLoader.readLines(input, (line) => line.split('').map(Number));
        const trailHeads: Point[] = [];

        for (let y = 0; y < trailMap.length; y++) {
            for (let x = 0; x < trailMap[y].length; x++) {
                if (trailMap[y][x] === 0) {
                    trailHeads.push({ x, y });
                }
            }
        }

        let hikingTrails = 0;

        for (const head of trailHeads) {
            const queue = new Queue<Point>();
            queue.enqueue(head);
            const nines: Point[] = [];

            while (queue.size() > 0) {
                const current = queue.dequeue();

                if (current) {
                    if (trailMap[current.y][current.x] === 9) {
                        if (!nines.some((n) => n.x === current.x && n.y === current.y)) {
                            nines.push(current);
                        }
                        continue;
                    }

                    const left = { x: current.x - 1, y: current.y };
                    const right = { x: current.x + 1, y: current.y };
                    const up = { x: current.x, y: current.y - 1 };
                    const down = { x: current.x, y: current.y + 1 };

                    if (this.isIncreasing(trailMap, current, left)) {
                        queue.enqueue(left);
                    }

                    if (this.isIncreasing(trailMap, current, right)) {
                        queue.enqueue(right);
                    }

                    if (this.isIncreasing(trailMap, current, up)) {
                        queue.enqueue(up);
                    }

                    if (this.isIncreasing(trailMap, current, down)) {
                        queue.enqueue(down);
                    }
                }
            }

            hikingTrails += nines.length;
        }

        return hikingTrails;
    }

    async part2(input: string): Promise<number | bigint> {
        const trailMap = this.dataLoader.readLines(input, (line) => line.split('').map(Number));
        const trailHeads: Point[] = [];

        for (let y = 0; y < trailMap.length; y++) {
            for (let x = 0; x < trailMap[y].length; x++) {
                if (trailMap[y][x] === 0) {
                    trailHeads.push({ x, y });
                }
            }
        }

        let hikingTrails = 0;

        for (const head of trailHeads) {
            const queue = new Queue<Point>();
            queue.enqueue(head);
            const nines: Point[] = [];

            while (queue.size() > 0) {
                const current = queue.dequeue();

                if (current) {
                    if (trailMap[current.y][current.x] === 9) {
                        hikingTrails++;
                        continue;
                    }

                    const left = { x: current.x - 1, y: current.y };
                    const right = { x: current.x + 1, y: current.y };
                    const up = { x: current.x, y: current.y - 1 };
                    const down = { x: current.x, y: current.y + 1 };

                    if (this.isIncreasing(trailMap, current, left)) {
                        queue.enqueue(left);
                    }

                    if (this.isIncreasing(trailMap, current, right)) {
                        queue.enqueue(right);
                    }

                    if (this.isIncreasing(trailMap, current, up)) {
                        queue.enqueue(up);
                    }

                    if (this.isIncreasing(trailMap, current, down)) {
                        queue.enqueue(down);
                    }
                }
            }
        }

        return hikingTrails;
    }

    private isIncreasing(trailMap: number[][], current: Point, next: Point): boolean {
        if (next.x < 0 || next.y < 0 || next.x >= trailMap[0].length || next.y >= trailMap.length) {
            return false;
        }

        return trailMap[next.y][next.x] === trailMap[current.y][current.x] + 1;
    }
}
