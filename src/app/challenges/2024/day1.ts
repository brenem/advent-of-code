import { DataLoader } from '../../../utils/data-loader';
import { DayChallenge } from '../day-challenge';

export class Day1 extends DayChallenge {
    constructor() {
        super(1, 2024);
    }

    async part1(input: string): Promise<number> {
        console.log(input);
        const data = DataLoader.readLines(input, (line) => {
            let parts = line.split(' ').filter((p) => !!p);
            const leftNum = parseInt(parts[0].trim());
            const rightNum = parseInt(parts[1].trim());

            return { leftNum, rightNum };
        });
console.log(data);
        const leftNumbers = data.map((d) => d.leftNum).sort();
        const rightNumbers = data.map((d) => d.rightNum).sort();

        const distances: number[] = [];
        for (let i = 0; i < leftNumbers.length; i++) {
            distances.push(Math.abs(rightNumbers[i] - leftNumbers[i]));
        }

        return distances.reduce((acc, curr) => acc + curr, 0);
    }

    async part2(input: string): Promise<number> {
        return 0;
    }
}
