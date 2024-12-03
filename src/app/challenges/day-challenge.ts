export abstract class DayChallenge {    
    constructor(private readonly day: number, private readonly year: number) {}

    abstract part1(input: string): Promise<number>;

    abstract part2(input: string): Promise<number>;
}