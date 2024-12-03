import { Logger } from '@deepkit/logger';
import { ChallengeLocator } from './challenge-locator';
import { InputProvider } from './input-provider';

export class Executor {
    constructor(private logger: Logger, private challengeLocator: ChallengeLocator, private inputProvider: InputProvider) {}

    async run(day: number, year: number, isSampleTest: boolean) {
        const challenge = await this.challengeLocator.findChallenge(day, year);
        if (challenge) {
            let input: string;
            let part1: number;
            let part2: number;

            if (isSampleTest) {
                const part1Input = await this.inputProvider.getSample(day, 1, year);
                const part2Input = await this.inputProvider.getSample(day, 2, year);

                part1 = await challenge.part1(part1Input);
                part2 = await challenge.part2(part2Input);
            } else {
                input = await this.inputProvider.getInput(day, year);

                part1 = await challenge.part1(input);
                part2 = await challenge.part2(input);
            }

            this.logger.log('Part 1:', part1);
            this.logger.log('Part 2:', part2);
        } else {
            this.logger.error('No challenge found for day', day, 'year', year);
        }
    }
}