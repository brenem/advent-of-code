import { DataLoader } from '../services/data-loader';

export abstract class Challenge {
    protected dataLoader = new DataLoader();
    
    abstract part1(input: string): Promise<number>;

    abstract part2(input: string): Promise<number>;
}