import { Service } from "typedi";

@Service()
export class DataLoader {
    readLines<T>(input: string, selector: (line: string) => T, separator: RegExp | string = '\n'): T[] {
        const normalized = this.normalizeLineEndings(input);
        const split = normalized.split(separator).filter(Boolean);
        return split.map(x => selector(x));
    }

    read2DMap<T>(input: string, selector: (char: string) => T, rowSeparator: RegExp | string = '\n', colSeparator: RegExp | string = ''): T[][] {
        const normalized = this.normalizeLineEndings(input);
        const split = normalized.split(rowSeparator).filter(Boolean);
        return split.map(x => x.split(colSeparator).map(y => selector(y)));
    }

    private normalizeLineEndings(input: string): string {
        return input.replaceAll('\r\n', '\n');
    }
}