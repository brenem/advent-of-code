import Container from 'typedi';
import { DataLoader } from '../services/data-loader';

export abstract class Challenge {
    protected dataLoader = Container.get(DataLoader);
    
    abstract part1(input: string): Promise<number>;

    abstract part2(input: string): Promise<number>;
}