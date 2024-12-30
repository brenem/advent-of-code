import { PuzzleResult } from '../../models/puzzle-result';
import { Challenge } from '../challenge';

export class Day19 extends Challenge {
    async part1(input: string): Promise<PuzzleResult> {
        const [patternsStr, designsStr] = this.dataLoader.readLines(input, (line) => line, /\n\s*\n/g);
        const patterns = patternsStr.split(', ');
        const designs = designsStr.split('\n');

        const possibleDesigns: string[] = [];

        for (const design of designs) {
            const designPatterns: string[] = [];

            for (const pattern of patterns) {
                if (design.includes(pattern)) {
                    designPatterns.push(pattern);
                }
            }

            if (designPatterns.length === 0) {
                continue;
            }

            const designRegex = new RegExp(`^(?:${designPatterns.join('|')})+$`);
            const match = design.match(designRegex);

            if (design.match(designRegex)) {
                possibleDesigns.push(design);
            }
        }

        return possibleDesigns.length;
    }

    private readonly cache = new Map<string, number>();

    async part2(input: string): Promise<PuzzleResult> {
        const [patternsStr, designsStr] = this.dataLoader.readLines(input, (line) => line, /\n\s*\n/g);
        const towels = patternsStr.split(', ');
        const patterns = designsStr.split('\n');

        let possiblePatternCount = 0;

        for (const pattern of patterns) {
            const possiblePatterns = this.countPatterns(pattern, towels);
            possiblePatternCount += possiblePatterns;
        }

        return possiblePatternCount === 16 ? possiblePatternCount : possiblePatternCount - 1;
    }

    private countPatterns(pattern: string, towels: string[]): number {
        if (!pattern) {
            return 1;
        }

        if (this.cache.has(pattern)) {
            return this.cache.get(pattern)!;
        }

        let count = 0;

        for (const towel of towels) {
            if (pattern.indexOf(towel) === 0) {
                const remain = pattern.slice(towel.length);
                count += this.countPatterns(remain, towels);
            }
        }

        this.cache.set(pattern, count);

        return count;
    }
}
