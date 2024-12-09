import { Executor } from '../services/executor';
import { Command } from 'commander';
import { Logger } from '../services/logger';
import { Container } from 'typedi';

export const runCommand = new Command('run')
    .description('Run a challenge')
    .option('-d, --day <day>', 'The day to run')
    .option('-y, --year <year>', 'The year to run')
    .option('-s, --sample', 'Run with sample input')
    .action(async (options: {day?: number, year?: number, sample?: boolean }) => {
        const executor = Container.get(Executor);
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

        // default sample to false if not provided
        options.sample = options.sample || false;

        logger.log(
            `Running day ${options.day}, year ${options.year}${options.sample ? ', with sample' : ''}`
        );

        await executor.run(options.day, options.year, options.sample);
    });
