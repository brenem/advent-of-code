import { Executor } from '../services/executor';
import { Command } from 'commander';
import { Logger } from '../services/logger';
import { Container } from 'typedi';

export const runCommand = new Command('run')
    .description('Run a challenge')
    .option('-d, --day <day>', 'The day to run')
    .option('-y, --year <year>', 'The year to run')
    .option('-p, --part <part>', 'The part to run')
    .option('-s, --sample', 'Run with sample input')
    .action(async (options: { day?: string; year?: string; part?: string; sample?: string }) => {
        const executor = Container.get(Executor);
        const logger = Container.get(Logger);

        let day = options.day ? Number(options.day) : undefined;
        let year = options.year ? Number(options.year) : undefined;
        let part = options.part ? Number(options.part) : undefined;
        let sample = options.sample ? Boolean(options.sample) : undefined;

        // if we are not in December, day is required, otherwise default to current day
        if (new Date().getMonth() === 11) {
            day = day || new Date().getDate();
        } else if (!day) {
            logger.error('Day is required');
            return;
        }

        // if year is not provided, default to the current year
        year = year || new Date().getFullYear();

        // default sample to false if not provided
        sample = sample || false;

        logger.log(
            `Running day ${day}, year ${year}${part ? `, part ${part}` : ''}${
                sample ? ', with sample' : ''
            }`
        );

        await executor.run(day, year, sample, part);
    });
