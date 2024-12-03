import { cli, Flag } from '@deepkit/app';
import { Logger } from '@deepkit/logger';
import { Executor } from '../app/services/executor';

@cli.controller('run')
export class RunCli {
    constructor(private logger: Logger, private executor: Executor) {}

    async execute(day?: number & Flag, year?: number & Flag, sample?: boolean & Flag) {
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

        // default sample to false if not provided
        sample = sample || false;

        this.logger.log('Running day', day, 'year', year, sample ? 'with sample' : '');
        await this.executor.run(day, year, sample);
    }
}
