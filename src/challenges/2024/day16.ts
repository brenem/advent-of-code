import { Challenge } from '../challenge';
import { Heap } from 'heap-js';
import { isOutOfBounds } from '../../helpers/utils';

interface NodeItem {
    row: number;
    col: number;
    direction: number[];
    score: number;
    path?: string[][];
    moves?: [number, number][];
}

const directions = [
    [-1, 0], // Up
    [0, 1], // Right
    [1, 0], // Down
    [0, -1] // Left
];

export class Day16 extends Challenge {
    async part1(input: string): Promise<number | bigint> {
        const gridMap = this.dataLoader.read2DMap(input, (c) => c);

        const startRow = gridMap.length - 2;
        const startCol = 1;

        const nodes = new Heap<NodeItem>((a, b) => a.score - b.score);
        nodes.push({
            row: startRow,
            col: startCol,
            direction: [0, 1],
            score: 0,
            path: gridMap.map((row) => [...row])
        });
        const visited = new Set<string>();

        while (nodes.length > 0) {
            const node = nodes.pop()!;

            if (this.checkVisited(visited, node)) {
                continue;
            }

            if (gridMap[node.row][node.col] === 'E') {
                return node.score;
            }

            directions.forEach((direction) => this.tryDirection(gridMap, nodes, node, direction));
        }

        throw new Error('No paths found');
    }

    async part2(input: string): Promise<number | bigint> {
        const gridMap = this.dataLoader.read2DMap(input, (c) => c);

        const startRow = gridMap.length - 2;
        const startCol = 1;

        const nodes = new Heap<NodeItem>((a, b) => a.score - b.score);
        nodes.push({
            row: startRow,
            col: startCol,
            direction: [0, 1],
            score: 0,
            path: gridMap.map((row) => [...row])
        });

        const bestScores = new Map<string, number>();
        let minScore = Infinity;
        const allPaths: NodeItem[] = [];

        while (nodes.length > 0) {
            const node = nodes.pop()!;
            const key = `${node.row}|${node.col}|${node.direction[0]}|${node.direction[1]}`;

            if (minScore < Infinity && node.score > minScore) {
                continue;
            }

            const prevBest = bestScores.get(key);
            if (prevBest !== undefined && prevBest < node.score) {
                continue;
            }

            bestScores.set(key, node.score);

            if (gridMap[node.row][node.col] === 'E') {
                if (node.score < minScore) {
                    minScore = node.score;
                    allPaths.length = 0;
                }

                allPaths.push(node);
                continue;
            }

            directions.forEach((direction) => this.tryDirection(gridMap, nodes, node, direction, true));
        }

        const minPathTiles = new Set<string>();
        minPathTiles.add(`${startRow}|${startCol}`); // start
        minPathTiles.add(`1|${gridMap[0].length - 2}`); // end

        allPaths.forEach((path) => {
            path.moves?.forEach(([row, col]) => {
                minPathTiles.add(`${row}|${col}`);
            });
        });

        return minPathTiles.size;
    }

    private checkVisited(visited: Set<string>, node: NodeItem): boolean {
        const key = `${node.row}-${node.col}-${node.direction[0]}-${node.direction[1]}`;
        if (visited.has(key)) {
            return true;
        }

        visited.add(key);
        return false;
    }

    private tryDirection(
        grid: string[][],
        nodes: Heap<NodeItem>,
        node: NodeItem,
        direction: number[],
        trackMoves = false
    ) {
        const [currDx, currDy] = node.direction;
        const [dx, dy] = direction;
        const nextRow = node.row + dx;
        const nextCol = node.col + dy;

        if (nextRow < 0 || nextRow >= grid.length || nextCol < 0 || nextCol >= grid[0].length) {
            return;
        }

        if (grid[nextRow][nextCol] === '#') {
            return;
        }

        if (dx === -currDx && dy === -currDy) {
            return;
        }

        const score = dx == currDx && dy === currDy ? 1 : 1001;

        const newNode: NodeItem = { row: nextRow, col: nextCol, direction: direction, score: node.score + score };

        if (!trackMoves) {
            const newPath = node.path ? node.path.map((row) => [...row]) : grid.map((row) => [...row]);

            const marker = dx === 0 ? (dy > 0 ? '>' : '<') : dx > 0 ? 'v' : '^';
            newPath[nextRow][nextCol] = marker;

            newNode.path = newPath;
        } else {
            newNode.moves = node.moves ? [...node.moves, [nextRow, nextCol]] : [[nextRow, nextCol]];
        }

        nodes.push(newNode);
    }
}
