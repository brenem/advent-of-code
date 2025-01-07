import { manhattan } from '../../algorithms/astar/heuristics';
import { groupBy } from '../../helpers/utils';
import { Grid, GridCoordinate } from '../../models/grid';
import { Point } from '../../models/point';
import { PuzzleResult } from '../../models/puzzle-result';
import { Challenge } from '../challenge';

interface CheatCost {
    cheatLocation: string;
    saving: number;
}

export class Day20 extends Challenge {
    async part1(input: string): Promise<PuzzleResult> {
        const map = this.dataLoader.readLines(input, (line) => line.split(''));
        const grid = new Grid(map);

        const tracks = this.getTracks(grid);

        const cheatLimit = 2;
        const cheatPaths = this.findCheatPaths(grid, tracks, cheatLimit, cheatLimit);

        const savings: CheatCost[] = cheatPaths.map((c) => ({
            cheatLocation: `${c.cheatLocation.location.x},${c.cheatLocation.location.y}`,
            saving: tracks.length - c.tracksCount
        }));

        return savings.filter((x) => x.saving >= 100).length;
    }

    async part2(input: string): Promise<PuzzleResult> {
        const map = this.dataLoader.readLines(input, (line) => line.split(''));
        const grid = new Grid(map);

        const tracks = this.getTracks(grid);

        const cheatLimit = 20;
        const cheatPaths = this.findCheatPaths(grid, tracks, 2, cheatLimit);

        const savings: CheatCost[] = cheatPaths.map((c) => ({
            cheatLocation: `${c.cheatLocation.location.x},${c.cheatLocation.location.y}`,
            saving: tracks.length - c.tracksCount
        }));

        const maxSavings = savings.filter((x) => x.saving >= 50);

        for (const maxSaving of maxSavings) {
            grid.set(+maxSaving.cheatLocation.split(',')[0], +maxSaving.cheatLocation.split(',')[1], 'C');
        }

        const grouped = groupBy(maxSavings, 'saving');

        this.logger.debug(grid.toString());

        return maxSavings.length;
    }

    private getTracks(grid: Grid): GridCoordinate[] {
        let current = grid.find('S')!;
        const tracks: GridCoordinate[] = [current];
        const visited = new Set<string>([`${current.location.x},${current.location.y}`]);

        while (true) {
            const next = this.getNextCell(grid, current, visited);
            tracks.push(next);

            if (next.character === 'E') {
                break;
            }

            current = next;
        }

        return tracks;
    }

    private getNextCell(grid: Grid, cell: GridCoordinate, visited: Set<string>): GridCoordinate {
        const southChar = grid.get(cell.south.x, cell.south.y)?.character;
        const northChar = grid.get(cell.north.x, cell.north.y)?.character;
        const eastChar = grid.get(cell.east.x, cell.east.y)?.character;
        const westChar = grid.get(cell.west.x, cell.west.y)?.character;
        const chars = ['.', 'E'];

        if (southChar && chars.includes(southChar) && !visited.has(`${cell.south.x},${cell.south.y}`)) {
            visited.add(`${cell.south.x},${cell.south.y}`);
            return grid.get(cell.south.x, cell.south.y)!;
        } else if (northChar && chars.includes(northChar) && !visited.has(`${cell.north.x},${cell.north.y}`)) {
            visited.add(`${cell.north.x},${cell.north.y}`);
            return grid.get(cell.north.x, cell.north.y)!;
        } else if (eastChar && chars.includes(eastChar) && !visited.has(`${cell.east.x},${cell.east.y}`)) {
            visited.add(`${cell.east.x},${cell.east.y}`);
            return grid.get(cell.east.x, cell.east.y)!;
        } else if (westChar && chars.includes(westChar) && !visited.has(`${cell.west.x},${cell.west.y}`)) {
            visited.add(`${cell.west.x},${cell.west.y}`);
            return grid.get(cell.west.x, cell.west.y)!;
        } else {
            throw new Error('Invalid direction');
        }
    }

    // private getCheatCells(grid: Grid, cell: GridCoordinate): GridCoordinate[] {
    //     const eastCell = grid.get(cell.east.x, cell.east.y);
    //     const westCell = grid.get(cell.west.x, cell.west.y);
    //     const northCell = grid.get(cell.north.x, cell.north.y);
    //     const southCell = grid.get(cell.south.x, cell.south.y);
    //     const cheatNeighbors: GridCoordinate[] = [];

    //     if (eastCell && eastCell.character === '#' && !this.isEdge(grid, cell.east)) {
    //         const eastEastCell = grid.get(eastCell.east.x, eastCell.east.y);
    //         if (eastEastCell?.character === '.' || eastEastCell?.character === 'E') {
    //             cheatNeighbors.push(eastEastCell);
    //         }
    //     }

    //     if (westCell && westCell.character === '#' && !this.isEdge(grid, cell.west)) {
    //         const westWestCell = grid.get(westCell.west.x, westCell.west.y);
    //         if (westWestCell?.character === '.' || westWestCell?.character === 'E') {
    //             cheatNeighbors.push(westWestCell);
    //         }
    //     }

    //     if (northCell && northCell.character === '#' && !this.isEdge(grid, cell.north)) {
    //         const northNorthCell = grid.get(northCell.north.x, northCell.north.y);
    //         if (northNorthCell?.character === '.' || northNorthCell?.character === 'E') {
    //             cheatNeighbors.push(northNorthCell);
    //         }
    //     }

    //     if (southCell && southCell.character === '#' && !this.isEdge(grid, cell.south)) {
    //         const southSouthCell = grid.get(southCell.south.x, southCell.south.y);
    //         if (southSouthCell?.character === '.' || southSouthCell?.character === 'E') {
    //             cheatNeighbors.push(southSouthCell);
    //         }
    //     }

    //     return cheatNeighbors;
    // }

    private isEdge(grid: Grid, cell: Point): boolean {
        return cell.x === 0 || cell.y === 0 || cell.x === grid.width - 1 || cell.y === grid.height - 1;
    }

    private findCheatPaths(
        grid: Grid,
        tracks: GridCoordinate[],
        cheatLengthMin: number,
        cheatLengthMax: number
    ): { cheatLocation: GridCoordinate; tracksCount: number }[] {
        const visited = new Set<string>();
        const cheatPaths: { cheatLocation: GridCoordinate; tracksCount: number }[] = [];

        for (const track of tracks) {
            visited.add(`${track.location.x},${track.location.y}`);

            const cheatLocations = tracks.filter((t) => {
                const distance = manhattan([track.location.x, track.location.y], [t.location.x, t.location.y]);
                return distance > 2 && distance <= cheatLengthMax;
            });

            if (cheatLocations.length > 0) {
                for (const cheatLocation of cheatLocations) {
                    if (visited.has(`${cheatLocation.location.x},${cheatLocation.location.y}`)) {
                        continue;
                    }

                    const cheatIndex = tracks.findIndex(
                        (x) => x.location.x === cheatLocation.location.x && x.location.y === cheatLocation.location.y
                    );
                    const tracksCountWithCheat = tracks.length - cheatIndex;

                    cheatPaths.push({
                        cheatLocation: cheatLocation,
                        tracksCount: visited.size + tracksCountWithCheat
                    });
                }
            }
        }

        return cheatPaths;
    }
}
