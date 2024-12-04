export class DataLoader {
    readLines<T>(input: string, selector: (line: string) => T, separator: string = '\n'): T[] {
        const normalized = this.normalizeLineEndings(input);
        const split = normalized.split(separator).filter((l) => !!l);
        return split.map(selector);
    }

    private normalizeLineEndings(input: string): string {
        return input.replace(/\r\n/g, '\n');
    }
}