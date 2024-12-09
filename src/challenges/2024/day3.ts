import { Challenge } from '../challenge';

export class Day3 extends Challenge {
    async part1(input: string): Promise<number> {
        const muls = input.match(/mul\(\d+,\d+\)/g)?.map((m) => m) || [];
        return this.sumMuls(muls);
    }

    async part2(input: string): Promise<number> {
        const matches = input.match(/(do\(\)|don\'t\(\)|mul\(\d+,\d+\))/g);
        const muls: string[] = [];
        let enabled = true;

        for (let match of matches!) {
            if (match === 'don\'t()') {
                enabled = false;
                continue;
            }
            
            if (match === 'do()') {
                enabled = true;
                continue;
            }

            if (enabled && match.startsWith('mul(')) {
                muls.push(match);
            }
        }

        return this.sumMuls(muls);
    }

    private sumMuls(muls: string[]): number {
        let result = 0;
        muls.forEach((mul) => {
            const [a, b] = mul.match(/\d+/g) || [];
            const mult = parseInt(a!) * parseInt(b);
            result += mult;
        }, 1);

        return result;
    }
}
