import { Point } from './point';

export class GridCoordinate {
    constructor(public grid: Grid, public character: string, public location: Point) {}

    get west(): Point {
        return { x: this.location.x - 1, y: this.location.y };
    }

    get east(): Point {
        return { x: this.location.x + 1, y: this.location.y };
    }

    get north(): Point {
        return { x: this.location.x, y: this.location.y - 1 };
    }

    get south(): Point {
        return { x: this.location.x, y: this.location.y + 1 };
    }

    clone(): GridCoordinate {
        return new GridCoordinate(this.grid, this.character, this.location);
    }
}

export class Grid {
    private grid: GridCoordinate[][];

    constructor(grid: string[][]) {
        this.grid = this.parseCoordinates(grid);
    }

    set(x: number, y: number, value: string): void {
        this.grid[y][x].character = value;
    }

    get(x: number, y: number): GridCoordinate | undefined {
        return this.grid[y][x];
    }

    find(character: string): GridCoordinate | undefined {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.grid[y][x].character === character) {
                    return this.grid[y][x];
                }
            }
        }

        return undefined;
    }

    findAll(character: string): GridCoordinate[] {
        const coordinates: GridCoordinate[] = [];

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.grid[y][x].character === character) {
                    coordinates.push(this.grid[y][x]);
                }
            }
        }

        return coordinates;
    }

    get width(): number {
        return this.grid[0].length;
    }

    get height(): number {
        return this.grid.length;
    }

    toMap(): string[][] {
        return this.grid.map((row) => row.map((coordinate) => coordinate.character));
    }

    toString(): string {
        return this.toMap()
            .map((row) => row.join(''))
            .join('\n');
    }

    private parseCoordinates(grid: string[][]): GridCoordinate[][] {
        const coordinates: GridCoordinate[][] = [];

        for (let y = 0; y < grid.length; y++) {
            const row = [];

            for (let x = 0; x < grid[y].length; x++) {
                const coordinate = new GridCoordinate(this, grid[y][x], { x, y });
                row.push(coordinate);
            }

            coordinates.push(row);
        }

        return coordinates;
    }
}
