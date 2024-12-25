import { Service } from 'typedi';
import { ResultWithStats } from '../models/result-with-stats';
import { FileHandler } from './file-handler';

@Service()
export class StatsProvider {
    constructor(private readonly fileHandler: FileHandler) { }

    async runWithStats<T>(action: () => Promise<T>): Promise<ResultWithStats<T>> {
        const startTime = performance.now();
        const result = await action();
        const endTime = performance.now();
        const executionTime = Math.round(endTime - startTime);
        return { result, startTime, endTime, executionTime };
    }

    saveStats<T>(day: number, year: number, part: number, result: ResultWithStats<T>) {
        const json = JSON.stringify(result, (key, value) => typeof value === 'bigint' ? value.toString() : value, 4);
        const filePath = `stats/${year}/day${day}-part${part}.json`;

        if (!this.fileHandler.exists(filePath)) {
            this.fileHandler.delete(filePath);
        }

        this.fileHandler.writeText(filePath, json);
    }
}
