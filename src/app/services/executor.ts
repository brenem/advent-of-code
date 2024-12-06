import { Logger } from '@deepkit/logger';
import { ChallengeLocator } from './challenge-locator';
import { InputProvider } from './input-provider';

export class Executor {
    constructor(
        private logger: Logger,
        private challengeLocator: ChallengeLocator,
        private inputProvider: InputProvider
    ) {}

    async run(day: number, year: number, isSampleTest: boolean) {
        const challenge = await this.challengeLocator.findChallenge(day, year);
        if (challenge) {
            if (isSampleTest) {
                const part1Input = await this.inputProvider.getSample(day, 1, year);
                const part2Input = await this.inputProvider.getSample(day, 2, year);

                await this.runPart1(challenge, part1Input);
                await this.runPart2(challenge, part2Input);
            } else {
                const input = await this.inputProvider.getInput(day, year);

                await this.runPart1(challenge, input);
                await this.runPart2(challenge, input);
            }
        } else {
            this.logger.error('No challenge found for day', day, 'year', year);
        }
    }

    private async runPart1(challenge: any, input: string) {
        if (!input) {
            throw new Error('No input provided for part 1');
        };

        this.logger.log('Running part 1...');

        const startTime = performance.now();
        const result = await challenge.part1(input);
        const endTime = performance.now();

        this.logger.log('Part 1:', result);
        this.logger.log('Execution time:', Math.round(endTime - startTime), 'ms\n');
    }

    private async runPart2(challenge: any, input: string) {
        if (!input) {
            throw new Error('No input provided for part 2');
        };

        this.logger.log('Running part 2...');
        
        const startTime = performance.now();
        const result = await challenge.part2(input);
        const endTime = performance.now();

        this.logger.log('Part 2:', result);
        this.logger.log('Execution time:', Math.round(endTime - startTime), 'ms\n');
    }
}
