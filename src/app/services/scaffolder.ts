import { Logger } from '@deepkit/logger';
import { ChallengesFileSystem, SamplesFileSystem } from '../filesystems';

export class Scaffolder {
    constructor(private logger: Logger, private samples: SamplesFileSystem, private challenges: ChallengesFileSystem) {}

    public async scaffold(day: number, year: number): Promise<void> {
        var challengeFilepath = `${year}/day${day}.ts`;
        var samplesPart1Filepath = `${year}/day${day}/part1.txt`;
        var samplesPart2Filepath = `${year}/day${day}/part2.txt`;

        if (await this.challenges.exists(challengeFilepath)) {
            this.logger.warn(`Challenge already exists: ${challengeFilepath}`, 'skipping...');
        } else {
            this.challenges.write(challengeFilepath, this.getChallengeTemplate(year, day));
        }

        if (await this.samples.exists(samplesPart1Filepath)) {
            this.logger.warn(`Sample part 1 already exists: ${samplesPart1Filepath}`, 'skipping...');
        } else {
            this.samples.write(samplesPart1Filepath, '');
        }

        if (await this.samples.exists(samplesPart2Filepath)) {
            this.logger.warn(`Sample part 2 already exists: ${samplesPart2Filepath}`, 'skipping...');
        } else {
            this.samples.write(samplesPart2Filepath, '');
        }
    }

    private getChallengeTemplate(year: number, day: number): string {
        return `import { Challenge } from \'../challenge\';

export class Day${day} extends Challenge {    
    async part1(input: string): Promise<number> {
        return 0;
    }

    async part2(input: string): Promise<number> {
        return 0;
    }
}`;
    }
}