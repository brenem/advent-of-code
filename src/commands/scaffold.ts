import { Scaffolder } from '../services/scaffolder';
import { Logger } from '../services/logger';
import { Command } from 'commander';
import { Container } from 'typedi';

export const scaffoldCommand = new Command('scaffold')
    .description('Scaffold a new challenge')
    .option('-d, --day <day>', 'The day to scaffold')
    .option('-y, --year <year>', 'The year to scaffold')
    .action(async (options: {day?: number, year?: number}) => {
        const scaffolder = Container.get(Scaffolder);
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

        logger.log(`Scaffolding day ${options.day}, year ${options.year}`);

        await scaffolder.scaffold(options.day, options.year);
    });
