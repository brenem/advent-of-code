import { Scaffolder } from '../services/scaffolder';
import { Logger } from '../services/logger';
import { Command } from 'commander';
import { Container } from 'typedi';

export const scaffoldCommand = new Command('scaffold')
    .description('Scaffold a new challenge')
    .option('-d, --day <day>', 'The day to scaffold')
    .option('-y, --year <year>', 'The year to scaffold')
    .action(async (day?: number, year?: number) => {
        const scaffolder = Container.get(Scaffolder);
        const logger = Container.get(Logger);

        // if we are not in December, day is required, otherwise default to current day
        if (new Date().getMonth() === 11) {
            day = day || new Date().getDate();
        } else if (!day) {
            logger.error('Day is required');
            return;
        }

        // if year is not provided, default to the current year
        year = year || new Date().getFullYear();

        logger.log(`Scaffolding day ${day}, year ${year}`);

        await scaffolder.scaffold(day, year);
    });
