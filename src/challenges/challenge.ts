import Container from 'typedi';
import { DataLoader } from '../services/data-loader';
import { Logger } from '../services/logger';

export abstract class Challenge {
    protected logger = Container.get(Logger);
    protected dataLoader = Container.get(DataLoader);
    
    abstract part1(input: string): Promise<number>;

    abstract part2(input: string): Promise<number>;
}