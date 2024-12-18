import { Challenge } from '../challenge';

export class Day11 extends Challenge {
    private _cache: Map<number, number[]> = new Map();

    async part1(input: string): Promise<number | bigint> {
        let stones = this.dataLoader.readLines(input, (line) => line.split(' ').map(Number))[0];

        let stoneList = new Map<number, number>();
        for (const stone of stones) {
            stoneList.set(stone, 1);
        }

        for (let i = 0; i < 25; i++) {
            let blink = new Map<number, number>();
            for (const stone of stoneList.keys()) {
                const multiplier = stoneList.get(stone)!;
                for (const newStone of this.blink(stone)) {
                    if (blink.has(newStone)) {
                        blink.set(newStone, blink.get(newStone)! + multiplier);
                    } else {
                        blink.set(newStone, multiplier);
                    }
                }
            }

            stoneList = blink;
        }

        let stoneCount = 0;
        for (const count of stoneList.values()) {
            stoneCount += count;
        }

        return stoneCount;
    }

    async part2(input: string): Promise<number | bigint> {
        let stones = this.dataLoader.readLines(input, (line) => line.split(' ').map(Number))[0];

        let stoneList = new Map<number, number>();
        for (const stone of stones) {
            stoneList.set(stone, 1);
        }

        for (let i = 0; i < 75; i++) {
            let blink = new Map<number, number>();
            for (const stone of stoneList.keys()) {
                const multiplier = stoneList.get(stone) || 0;
                for (const newStone of this.blink(stone)) {
                    if (blink.has(newStone)) {
                        blink.set(newStone, blink.get(newStone)! + multiplier);
                    } else {
                        blink.set(newStone, multiplier);
                    }
                }
            }

            stoneList = blink;
        }

        let stoneCount = 0;
        for (const count of stoneList.values()) {
            stoneCount += count;
        }

        return stoneCount;
    }

    private blink(stone: number): number[] {
        if (this._cache.has(stone)) {
            return this._cache.get(stone) || [];
        }

        let newStones: number[] = [];
        const stoneLength = stone.toString().length;

        if (stone === 0) {
            newStones.push(1);
        } else if (stoneLength % 2 === 0) {
            const left = stone.toString().slice(0, stoneLength / 2);
            const right = stone.toString().slice(stoneLength / 2);

            newStones.push(parseInt(left));
            newStones.push(parseInt(right));
        } else {
            const newNum = stone * 2024;
            newStones.push(newNum);
        }

        this._cache.set(stone, newStones);
        return newStones;
    }
}
