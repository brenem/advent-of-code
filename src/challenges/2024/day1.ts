import { Challenge } from '../challenge';

export class Day1 extends Challenge {    
    async part1(input: string): Promise<bigint> {
        const data = this.getData(input);

        const leftNumbers = data.map((d) => d.leftNum).sort();
        const rightNumbers = data.map((d) => d.rightNum).sort();

        const distances: number[] = [];
        for (let i = 0; i < leftNumbers.length; i++) {
            distances.push(Math.abs(rightNumbers[i] - leftNumbers[i]));
        }

        return BigInt(distances.reduce((acc, curr) => acc + curr, 0));
    }

    async part2(input: string): Promise<bigint> {
        const data = this.getData(input);

        const leftNumbers = data.map((d) => d.leftNum);
        const rightNumbers = data.map((d) => d.rightNum);

        const similarityScores: number[] = [];
        for (let i = 0; i < leftNumbers.length; i++) {
            // count how many times leftNumbers[i] is in the rightNumbers array
            const count = rightNumbers.filter((n) => n === leftNumbers[i]).length;
            const similarityScore = leftNumbers[i] * count;
            similarityScores.push(similarityScore);
        }

        return BigInt(similarityScores.reduce((acc, curr) => acc + curr, 0));
    }

    private getData(input: string): { leftNum: number; rightNum: number }[] {
        return this.dataLoader.readLines(input, (line) => {
            let parts = line.split(' ').filter((p) => !!p);
            const leftNum = parseInt(parts[0].trim());
            const rightNum = parseInt(parts[1].trim());

            return { leftNum, rightNum };
        });
    }
}
