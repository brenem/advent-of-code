import { dir } from 'node:console';
import { Direction } from '../../models/directions';
import { Grid, GridCoordinate } from '../../models/grid';
import { Challenge } from '../challenge';

const dirMap: {[key: number]: string} = {
    [Direction.Up]: '^',
    [Direction.Down]: 'v',
    [Direction.Left]: '<',
    [Direction.Right]: '>',
};

export class Day15 extends Challenge {
    async part1(input: string): Promise<number | bigint> {
        const sections = this.dataLoader.readLines(input, (line) => line, /\n\s*\n/g);
        const map = this.dataLoader.readLines(sections[0], (line) => line.split(''));
        const moves = this.dataLoader
            .readLines(sections[1], (line) => line)
            .join('')
            .split('')
            .map(this.parseDirection);

        const gridMap = new Grid(map);
        let robot = gridMap.find('@');

        for (const move of moves) {
            robot = this.moveRobot(gridMap, robot!, move);
        }

        const boxCoordinates = gridMap.findAll('O');
        let gpsSum = 0;
        for (const box of boxCoordinates) {
            gpsSum += 100 * box.location.y + box.location.x;
        }

        return gpsSum;
    }

    async part2(input: string): Promise<number | bigint> {
        const sections = this.dataLoader.readLines(input, (line) => line, /\n\s*\n/g);
        const map = this.dataLoader
            .readLines(sections[0], (line) => line)
            .map((line) => {
                return line
                    .split('')
                    .map<string>((x) => {
                        if (x === '.' || x === '#') {
                            return Array(2).fill(x).join('');
                        }

                        if (x === 'O') {
                            return '[]';
                        }

                        if (x === '@') {
                            return '@.';
                        }

                        return '';
                    })
                    .join('');
            })
            .map((line) => line.split(''));

        const moves = this.dataLoader
            .readLines(sections[1], (line) => line)
            .join('')
            .split('')
            .map(this.parseDirection);

        const gridMap = new Grid(map);
        let robot = gridMap.find('@');

        // this.logger.debug(gridMap.toString());
        // this.logger.debug('\n');

        for (const move of moves) {
            robot = this.moveRobotExpanded(gridMap, robot!, move);
            // this.logger.debug('Move:', dirMap[move]);
            // this.logger.debug(gridMap.toString());
            // this.logger.debug('\n');
        }

        // this.logger.debug(gridMap.toString());
        // this.logger.debug('\n');

        const boxCoordinates = gridMap.findAll('[');
        const boxPairs = boxCoordinates.map((box) => this.getBoxPair(gridMap, box)!);

        let gpsSum = 0;
        for (const boxPair of boxPairs) {
            const leftDistance = boxPair[0].location.x;
            const rightDistance = gridMap.width - boxPair[1].location.x;
            let edgeDistance: number;
            if (leftDistance <= rightDistance) {
                edgeDistance = leftDistance;
            } else {
                edgeDistance = rightDistance;
            }
            // const topDistance = boxPair[0].location.y;

            gpsSum += 100 * boxPair[0].location.y + boxPair[0].location.x;
        }

        return gpsSum;
    }

    private parseDirection(move: string): Direction {
        switch (move) {
            case '^':
                return Direction.Up;
            case 'v':
                return Direction.Down;
            case '<':
                return Direction.Left;
            case '>':
                return Direction.Right;
            default:
                throw new Error(`Invalid direction: ${move}`);
        }
    }

    private moveRobot(grid: Grid, robot: GridCoordinate, direction: Direction): GridCoordinate {
        let next = this.getNextCoordinate(grid, robot, direction);

        if (next?.character === 'O') {
            const boxes: GridCoordinate[] = [];
            let box = next.clone();
            while (box?.character === 'O') {
                boxes.push(box);
                box = this.getNextCoordinate(grid, box, direction)!;
            }

            const nextAfterLastBox = this.getNextCoordinate(grid, boxes[boxes.length - 1], direction);
            if (nextAfterLastBox?.character === '.') {
                for (let i = boxes.length - 1; i >= 0; i--) {
                    this.moveBox(grid, boxes[i], direction);
                }

                grid.set(robot.location.x, robot.location.y, '.');
                grid.set(next.location.x, next.location.y, '@');

                return next;
            }

            return robot;
        } else if (next?.character === '.') {
            grid.set(robot.location.x, robot.location.y, '.');
            grid.set(next.location.x, next.location.y, '@');
            return next;
        } else {
            return robot;
        }
    }

    private moveRobotExpanded(grid: Grid, robot: GridCoordinate, direction: Direction): GridCoordinate {
        let next = this.getNextCoordinate(grid, robot, direction);

        if (next?.character === '[' || next?.character === ']') {
            let boxPairs = [this.getBoxPair(grid, next)!];
            const foundBoxPairs: GridCoordinate[][][] = [];

            while (boxPairs) {
                foundBoxPairs.push(boxPairs);
                boxPairs = this.getNextBoxPairs(grid, boxPairs, direction)!;
            }

            let hitAWall = false;

            for (let i = foundBoxPairs.length - 1; i >= 0; i--) {
                for (let j = foundBoxPairs[i].length - 1; j >= 0; j--) {
                    const nextLeftBoxPart = this.getNextCoordinate(grid, foundBoxPairs[i][j][0], direction);
                    const nextRightBoxPart = this.getNextCoordinate(grid, foundBoxPairs[i][j][1], direction);
                    if (nextLeftBoxPart?.character === '#' || nextRightBoxPart?.character === '#') {
                        hitAWall = true;
                        break;
                    }
                }
            }

            if (!hitAWall) {
                for (let i = foundBoxPairs.length - 1; i >= 0; i--) {
                    for (let j = foundBoxPairs[i].length - 1; j >= 0; j--) {
                        this.moveBoxExpanded(grid, foundBoxPairs[i][j], direction);
                    }
                }

                grid.set(robot.location.x, robot.location.y, '.');
                grid.set(next.location.x, next.location.y, '@');

                return next;
            }

            return robot;
        } else if (next?.character === '.') {
            grid.set(robot.location.x, robot.location.y, '.');
            grid.set(next.location.x, next.location.y, '@');
            return next;
        } else {
            return robot;
        }
    }

    private moveBox(grid: Grid, box: GridCoordinate, direction: Direction): void {
        const next = this.getNextCoordinate(grid, box, direction);
        if (next) {
            grid.set(next.location.x, next.location.y, 'O');
        }
    }

    private moveBoxExpanded(grid: Grid, boxPair: GridCoordinate[], direction: Direction): void {
        const nextBoxPartLeft = this.getNextCoordinate(grid, boxPair[0], direction);
        const nextBoxPartRight = this.getNextCoordinate(grid, boxPair[1], direction);
        if (nextBoxPartLeft && nextBoxPartRight) {
            grid.set(boxPair[0].location.x, boxPair[0].location.y, '.');
            grid.set(boxPair[1].location.x, boxPair[1].location.y, '.');

            grid.set(nextBoxPartLeft.location.x, nextBoxPartLeft.location.y, '[');
            grid.set(nextBoxPartRight.location.x, nextBoxPartRight.location.y, ']');
        }
    }

    private getBoxPair(grid: Grid, coordinate: GridCoordinate | undefined): GridCoordinate[] | undefined {
        if (coordinate?.character === '[') {
            return [coordinate.clone(), this.getNextCoordinate(grid, coordinate, Direction.Right)!];
        } else if (coordinate?.character === ']') {
            return [this.getNextCoordinate(grid, coordinate, Direction.Left)!, coordinate.clone()];
        } else {
            return undefined;
        }
    }

    private getNextCoordinate(grid: Grid, current: GridCoordinate, direction: Direction): GridCoordinate | undefined {
        switch (direction) {
            case Direction.Up:
                return grid.get(current.up.x, current.up.y);
            case Direction.Down:
                return grid.get(current.down.x, current.down.y);
            case Direction.Left:
                return grid.get(current.left.x, current.left.y);
            case Direction.Right:
                return grid.get(current.right.x, current.right.y);
            default:
                return undefined;
        }
    }

    private getNextBoxPairs(
        grid: Grid,
        boxPairs: GridCoordinate[][],
        direction: Direction
    ): GridCoordinate[][] | undefined {
        let nextBoxPart: GridCoordinate | undefined;
        const nextBoxPairs: GridCoordinate[][] = [];

        if (direction === Direction.Right) {
            nextBoxPart = this.getNextCoordinate(grid, boxPairs[0][1], direction);
            const nextBoxPair = this.getBoxPair(grid, nextBoxPart);
            if (nextBoxPair) {
                nextBoxPairs.push(nextBoxPair);
            }
        } else if (direction === Direction.Left) {
            nextBoxPart = this.getNextCoordinate(grid, boxPairs[0][0], direction);
            const nextBoxPair = this.getBoxPair(grid, nextBoxPart);
            if (nextBoxPair) {
                nextBoxPairs.push(nextBoxPair);
            }
        } else if (direction === Direction.Up || direction === Direction.Down) {
            for (const boxPair of boxPairs) {
                const nextLeftBoxPart = this.getNextCoordinate(grid, boxPair[0], direction);
                const nextRightBoxPart = this.getNextCoordinate(grid, boxPair[1], direction);
                const nextLeftBoxPair = this.getBoxPair(grid, nextLeftBoxPart);
                const nextRightBoxPair = this.getBoxPair(grid, nextRightBoxPart);

                if (nextLeftBoxPair) {
                    nextBoxPairs.push(nextLeftBoxPair);
                }
                if (nextRightBoxPair) {
                    nextBoxPairs.push(nextRightBoxPair);
                }
            }
        }

        return nextBoxPairs.length > 0 ? nextBoxPairs : undefined;
    }
}
