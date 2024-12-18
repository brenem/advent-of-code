import { Logger } from './logger';
import { Service } from 'typedi';
import { FileHandler } from './file-handler';

@Service()
export class Scaffolder {
    constructor(private logger: Logger, private fileHandler: FileHandler) {}

    public async scaffold(day: number, year: number): Promise<void> {
        const challengeFilepath = `src/challenges/${year}/day${day}.ts`;
        const samplesPart1Filepath = `samples/${year}/day${day}/part1.txt`;
        const samplesPart2Filepath = `samples/${year}/day${day}/part2.txt`;

        if (await this.fileHandler.exists(challengeFilepath)) {
            this.logger.warn(
                `Challenge already exists: ${challengeFilepath}, skipping...`
            );
        } else {
            await this.fileHandler.writeText(
                challengeFilepath,
                this.getChallengeTemplate(year, day)
            );
        }

        if (await this.fileHandler.exists(samplesPart1Filepath)) {
            this.logger.warn(
                `Sample part 1 already exists: ${samplesPart1Filepath}, skipping...`
            );
        } else {
            await this.fileHandler.writeText(samplesPart1Filepath, '');
        }

        if (await this.fileHandler.exists(samplesPart2Filepath)) {
            this.logger.warn(
                `Sample part 2 already exists: ${samplesPart2Filepath}, skipping...`
            );
        } else {
            await this.fileHandler.writeText(samplesPart2Filepath, '');
        }
    }

    private getChallengeTemplate(year: number, day: number): string {
        return `import { Challenge } from '../challenge';

export class Day${day} extends Challenge {    
    async part1(input: string): Promise<number | bigint> {
        return 0;
    }

    async part2(input: string): Promise<number | bigint> {
        return 0;
    }
}`;
    }
}
