import { Command } from 'commander';
import { Container } from 'typedi';
import { Downloader } from '../services/downloader';
import { Logger } from '../services/logger';
import { FileHandler } from '../services/file-handler';

export const downloadInputCommand = new Command('download-input')
    .description('Download input for a challenge')
    .option('-d, --day <day>', 'The day to download')
    .option('-y, --year <year>', 'The year to download')
    .action(async (options: { day?: number; year?: number }) => {
        const downloader = Container.get(Downloader);
        const fileHandler = Container.get(FileHandler);
        const logger = Container.get(Logger);

        // if we are not in December, day is required, otherwise default to current day
        if (new Date().getMonth() === 11) {
            options.day = options.day || new Date().getDate();
        } else if (!options.day) {
            logger.error('Day is required');
            return;
        }

        // if year is not provided, default to the current year
        options.year = options.year || new Date().getFullYear();

        logger.log(`Downloading input for day ${options.day}, year ${options.year}`);

        const filePath = `inputs/${options.year}/day${options.day}.txt`;
        if (await fileHandler.exists(filePath)) {
            logger.log('File already exists\n');
            return;
        }

        const result = await downloader.downloadInput(options.day, options.year);
        await fileHandler.writeBuffer(filePath, result);
        logger.log('Downloaded input to ' + filePath + '\n');
    });
