export class DataLoader {
    private constructor() {}

    static readLines<T>(input: string, selector: (line: string) => T, separator: string = '\r\n'): T[] {
        return input.split(separator).map(selector);
    }
}