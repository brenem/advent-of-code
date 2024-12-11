import { Downloader } from './downloader';
import { Logger } from './logger';
import { Service } from 'typedi';
import { FileHandler } from './file-handler';

@Service()
export class InputProvider {
    constructor(private logger: Logger, private downloader: Downloader, private fileHandler: FileHandler) {}

    async getInput(day: number, year?: number): Promise<string> {
        // if year is not provided, default to the current year
        year = year || new Date().getFullYear();

        const filePath = `inputs/${year}/day${day}.txt`;
        if (await this.fileHandler.exists(filePath)) {
            this.logger.log('Input file already exists, reading from disk\n');
            return this.fileHandler.readAllText(filePath);
        }

        this.logger.log(
            'Input file not found, downloading from Advent of Code\n'
        );
        const result = await this.downloader.downloadInput(day, year);
        await this.fileHandler.writeText(filePath, result);

        return result;
    }

    async getSample(day: number, part: number, year?: number) {
        // if year is not provided, default to the current year
        year = year || new Date().getFullYear();

        const filePath = `samples/${year}/day${day}/part${part}.txt`;
        if (await this.fileHandler.exists(filePath)) {
            return this.fileHandler.readAllText(filePath);
        }

        this.logger.warn(`Sample file not found: ${filePath}\n`);
        return '';
    }
}
