import { Logger } from "@deepkit/logger";
import { Downloader } from "./downloader";
import { InputsFileSystem, SamplesFileSystem } from "../filesystems";

export class InputProvider {
    constructor(private logger: Logger, private inputs: InputsFileSystem, private samples: SamplesFileSystem, private downloader: Downloader) { }

    async getInput(day: number, year?: number): Promise<string> {
        // if year is not provided, default to the current year
        year = year || new Date().getFullYear();

        const filePath = `${year}/day${day}.txt`;
        if (await this.inputs.exists(filePath)) {
            this.logger.log('Input file already exists, reading from disk');
            return await this.inputs.readAsText(filePath);
        }

        this.logger.log('Input file not found, downloading from Advent of Code');
        const result = await this.downloader.downloadInput(day, year);
        this.inputs.write(filePath, result);

        return result;
    }

    async getSample(day: number, part: number, year?: number) {
        // if year is not provided, default to the current year
        year = year || new Date().getFullYear();

        const filePath = `${year}/day${day}/part${part}.txt`;
        if (await this.samples.exists(filePath)) {
            return await this.samples.readAsText(filePath);
        } else {
            this.logger.warn(`Sample file not found: ${filePath}`);
            return '';
        }
    }
}