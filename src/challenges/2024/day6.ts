import { Direction } from '../../models/directions';
import { Heading } from '../../models/heading';
import { Queue } from '../../models/queue';
import { Challenge } from '../challenge';
import { move } from '../../helpers/grid-helpers';
import { Point } from '../../models/point';

export class Day6 extends Challenge {
    async part1(input: string): Promise<number | bigint> {
        const grid = this.dataLoader.readLines(input, (line) => line.split(''));

        const visited = this.getVisitedHeadings(grid);
        return visited.length;
    }

    async part2(input: string): Promise<number | bigint> {
        const grid = this.dataLoader.readLines(input, (line) => line.split(''));

        const visitedHeadings = this.getVisitedHeadings(grid);
        let inifiteLoops = 0;

        for (let i = 1; i < visitedHeadings.length; i++) {
            const current = visitedHeadings[i];
            const testGrid = grid.map((row) => [...row]);

            if (this.isOutOfBounds(testGrid, current.heading.location)) {
                continue;
            }

            testGrid[current.heading.location.y][current.heading.location.x] = 'O';

            const newResult = this.getVisitedHeadings(testGrid);
            if (newResult.some((x) => x.count > 4)) {
                inifiteLoops++;
            }
        }

        return inifiteLoops;
    }

    private getVisitedHeadings(grid: string[][]): { heading: Heading; count: number }[] {
        const startRow = grid.findIndex((row) => row.includes('^'));
        const startCol = grid[startRow].indexOf('^');
        const startHeading = { location: { x: startCol, y: startRow }, direction: Direction.Up };

        const queue = new Queue<Heading>();
        queue.enqueue(startHeading);

        const visitedHeadings: { heading: Heading; count: number }[] = [];

        while (queue.size() > 0) {
            const currentHeading = queue.dequeue();
            if (currentHeading) {
                const visitation = visitedHeadings.find(
                    (v) =>
                        v.heading.location.x === currentHeading?.location.x &&
                        v.heading.location.y === currentHeading?.location.y
                );
                if (!visitation) {
                    visitedHeadings.push({ heading: currentHeading, count: 1 });
                } else {
                    visitation.count++;
                    if (visitation.count > 4) {
                        break;
                    }
                }

                const nextLocation = move(currentHeading.location, currentHeading.direction);

                if (this.isOutOfBounds(grid, nextLocation)) {
                    break;
                }

                const nextChar = grid[nextLocation.y][nextLocation.x];

                if (nextChar === '.' || nextChar === '^') {
                    queue.enqueue({ location: nextLocation, direction: currentHeading.direction });
                } else if (nextChar === '#' || nextChar === 'O') {
                    let nextHeading = this.getNextHeading(grid, currentHeading);
                    queue.enqueue(nextHeading);
                }
            }
        }

        return visitedHeadings;
    }

    private isOutOfBounds(grid: string[][], location: Point): boolean {
        return location.x >= grid[0].length || location.y >= grid.length || location.x < 0 || location.y < 0;
    }

    private getNextHeading(grid: string[][], currentHeading: Heading): Heading {
        let nextHeading: Heading;

        switch (currentHeading.direction) {
            case Direction.Up:
                const newLocationEast = move(currentHeading.location, Direction.Right);
                if (grid[newLocationEast.y][newLocationEast.x] === '#' || grid[newLocationEast.y][newLocationEast.x] === 'O') {
                    const newLocationSouth = move(currentHeading.location, Direction.Down);
                    if (grid[newLocationSouth.y][newLocationSouth.x] === '#' || grid[newLocationSouth.y][newLocationSouth.x] === 'O') {
                        const newLocationWest = move(currentHeading.location, Direction.Left);
                        nextHeading = { location: newLocationWest, direction: Direction.Left };
                    } else {
                        nextHeading = { location: newLocationSouth, direction: Direction.Down };
                    }
                } else {
                    nextHeading = {
                        location: newLocationEast,
                        direction: Direction.Right
                    };
                }
                break;
            case Direction.Down:
                let newLocationWest = move(currentHeading.location, Direction.Left);
                if (grid[newLocationWest.y][newLocationWest.x] === '#' || grid[newLocationWest.y][newLocationWest.x] === 'O') {
                    let newLocationNorth = move(currentHeading.location, Direction.Up);
                    if (grid[newLocationNorth.y][newLocationNorth.x] === '#' || grid[newLocationNorth.y][newLocationNorth.x] === 'O') {
                        let newLocationEast = move(currentHeading.location, Direction.Right);
                        nextHeading = { location: newLocationEast, direction: Direction.Right };
                    } else {
                        nextHeading = { location: newLocationNorth, direction: Direction.Up };
                    }
                } else {
                    nextHeading = {
                        location: newLocationWest,
                        direction: Direction.Left
                    };
                }
                break;
            case Direction.Right:
                let newLocationSouth = move(currentHeading.location, Direction.Down);
                if (grid[newLocationSouth.y][newLocationSouth.x] === '#' || grid[newLocationSouth.y][newLocationSouth.x] === 'O') {
                    let newLocationWest = move(currentHeading.location, Direction.Left);
                    if (grid[newLocationWest.y][newLocationWest.x] === '#' || grid[newLocationWest.y][newLocationWest.x] === 'O') {
                        let newLocationNorth = move(currentHeading.location, Direction.Up);
                        nextHeading = { location: newLocationNorth, direction: Direction.Up };
                    } else {
                        nextHeading = { location: newLocationWest, direction: Direction.Left };
                    }
                } else {
                    nextHeading = {
                        location: newLocationSouth,
                        direction: Direction.Down
                    };
                }
                break;
            case Direction.Left:
                let newLocationNorth = move(currentHeading.location, Direction.Up);
                if (grid[newLocationNorth.y][newLocationNorth.x] === '#' || grid[newLocationNorth.y][newLocationNorth.x] === 'O') {
                    let newLocationEast = move(currentHeading.location, Direction.Right);
                    if (grid[newLocationEast.y][newLocationEast.x] === '#' || grid[newLocationEast.y][newLocationEast.x] === 'O') {
                        let newLocationSouth = move(currentHeading.location, Direction.Down);
                        nextHeading = { location: newLocationSouth, direction: Direction.Down };
                    } else {
                        nextHeading = { location: newLocationEast, direction: Direction.Right };
                    }
                } else {
                    nextHeading = {
                        location: newLocationNorth,
                        direction: Direction.Up
                    };
                }
                break;
            default:
                throw new Error('Invalid direction');
        }

        return nextHeading;
    }
}
