import { delay } from '../../helpers/delay';
import { Point } from '../../models/point';
import { Challenge } from '../challenge';

interface RobotConfig {
    position: Point;
    velocity: Point;
}

export class Day14 extends Challenge {
    async part1(input: string): Promise<number | bigint> {
        const configs = this.dataLoader.readLines(input, (line) => {
            const parts = line.split(' ');
            const position = parts[0].split('=')[1].split(',');
            const velocity = parts[1].split('=')[1].split(',');

            return {
                position: { x: parseInt(position[0]), y: parseInt(position[1]) },
                velocity: { x: parseInt(velocity[0]), y: parseInt(velocity[1]) }
            } as RobotConfig;
        });

        // const gridSize: Point = { x: 11, y: 7 };
        const gridSize: Point = { x: 101, y: 103 };
        const start = 1;
        const seconds = 100;

        const robotPositions: Point[] = [];

        for (let i = 0; i < configs.length; i++) {
            const finalPosition = this.walkRobot(configs[i], gridSize, start, seconds);
            robotPositions.push(finalPosition);
        }

        const safetyFactor = this.calculateSafetyFactor(robotPositions, gridSize);
        return safetyFactor;
    }

    async part2(input: string): Promise<number | bigint> {
        const configs = this.dataLoader.readLines(input, (line) => {
            const parts = line.split(' ');
            const position = parts[0].split('=')[1].split(',');
            const velocity = parts[1].split('=')[1].split(',');

            return {
                position: { x: parseInt(position[0]), y: parseInt(position[1]) },
                velocity: { x: parseInt(velocity[0]), y: parseInt(velocity[1]) }
            } as RobotConfig;
        });

        // const gridSize: Point = { x: 11, y: 7 };
        const gridSize: Point = { x: 101, y: 103 };
        const start = 1;
        let seconds = 65;

        let robotPositions: Point[] = [];

        while (true) {
            for (let i = 0; i < configs.length; i++) {
                const finalPosition = this.walkRobot(configs[i], gridSize, start, seconds);
                robotPositions.push(finalPosition);
            }

            this.logger.debug(`Seconds: ${seconds}`);
            this.renderRobots(robotPositions, gridSize);

            robotPositions = [];
            seconds += 103;

            await delay(500);
        }

        return seconds;
    }

    private walkRobot(config: RobotConfig, gridSize: Point, start: number, seconds: number): Point {
        let newPosition = { x: config.position.x + config.velocity.x, y: config.position.y + config.velocity.y };

        if (newPosition.x < 0 || newPosition.x >= gridSize.x || newPosition.y < 0 || newPosition.y >= gridSize.y) {
            newPosition = this.teleportRobot(config, gridSize);
        }

        if (start < seconds) {
            return this.walkRobot({ position: newPosition, velocity: config.velocity }, gridSize, start + 1, seconds);
        } else {
            return newPosition;
        }
    }

    private teleportRobot(config: RobotConfig, gridSize: Point): Point {
        let newPosition = { x: config.position.x + config.velocity.x, y: config.position.y + config.velocity.y };

        if (newPosition.x < 0) {
            newPosition.x = gridSize.x - Math.abs(newPosition.x);
        } else if (newPosition.x >= gridSize.x) {
            newPosition.x = Math.abs(gridSize.x - newPosition.x);
        }

        if (newPosition.y < 0) {
            newPosition.y = gridSize.y - Math.abs(newPosition.y);
        } else if (newPosition.y >= gridSize.y) {
            newPosition.y = Math.abs(gridSize.y - newPosition.y);
        }

        return newPosition;
    }

    private calculateSafetyFactor(robotPositions: Point[], gridSize: Point): number {
        const [firstQuadrantRobots, secondQuadrantRobots, thirdQuadrantRobots, fourthQuadrantRobots] =
            this.buildQuadrants(robotPositions, gridSize);
        const safetyFactor = firstQuadrantRobots * secondQuadrantRobots * thirdQuadrantRobots * fourthQuadrantRobots;
        return safetyFactor;
    }

    private buildQuadrants(robotPositions: Point[], gridSize: Point): number[] {
        const xQuadFactor = Math.floor(gridSize.x / 2);
        const yQuadFactor = Math.floor(gridSize.y / 2);

        const firstQuadrantRobots = robotPositions.filter((pos) => pos.x < xQuadFactor && pos.y < yQuadFactor).length;
        const secondQuadrantRobots = robotPositions.filter((pos) => pos.x > xQuadFactor && pos.y < yQuadFactor).length;
        const thirdQuadrantRobots = robotPositions.filter((pos) => pos.x < xQuadFactor && pos.y > yQuadFactor).length;
        const fourthQuadrantRobots = robotPositions.filter((pos) => pos.x > xQuadFactor && pos.y > yQuadFactor).length;

        return [firstQuadrantRobots, secondQuadrantRobots, thirdQuadrantRobots, fourthQuadrantRobots];
    }

    private renderRobots(positions: Point[], gridSize: Point): void {
        this.logger.log(Array(gridSize.y).fill('-').join(''));
        let grid = new Array(gridSize.y).fill(' '.repeat(gridSize.x));
        for (let i = 0; i < positions.length; i++) {
            const pos = positions[i];
            grid[pos.y] = grid[pos.y].substring(0, pos.x) + '#' + grid[pos.y].substring(pos.x + 1);
        }

        this.logger.log(grid.join('\n'));
    }
}
