import { cli, Flag } from '@deepkit/app';
import { Logger } from '@deepkit/logger';
import { Scaffolder } from '../app/services/scaffolder';

@cli.controller('scaffold')
export class ScaffoldCli {
    constructor(private logger: Logger, private scaffolder: Scaffolder) {}

    async execute(day?: number & Flag, year?: number & Flag) {
        // if we are not in December, day is required, otherwise default to current day
        if (new Date().getMonth() !== 11) {
            if (!day) {
                this.logger.error('Day is required');
                return;
            }
        } else {
            day = day || new Date().getDate();
        }

        // if year is not provided, default to the current year
        year = year || new Date().getFullYear();

        this.logger.log('Scaffolding day', day, 'year', year);
        await this.scaffolder.scaffold(day, year);
    }
}
