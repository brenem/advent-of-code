import { Challenge } from '../challenge';
import { Container } from 'typedi';
import { FileHandler } from '../../services/file-handler';

interface Block {
    isFile: boolean;
    id?: number;
    length: number;
}

export class Day9 extends Challenge {
    private readonly fileHandler = Container.get(FileHandler);
    async part1(input: string): Promise<bigint> {
        const diskMap = this.dataLoader.readLines(input, (line) => line.split('').map(Number))[0];

        const blocks = this.parseDiskMap(diskMap);
        const layout = this.generateLayout(blocks);
        const compressed = this.compress(layout);
        const checksum = this.getChecksum(compressed);

        return checksum;
    }

    async part2(input: string): Promise<bigint> {
        const diskMap = this.dataLoader.readLines(input, (line) => line.split('').map(Number))[0];

        const blocks = this.parseDiskMap(diskMap);
        const layout = this.generateWholeFileLayout(blocks);
        // this.logger.debug(layout.join(''));
        const compressedWholeFiles = this.compressWholeFiles(layout, layout.length - 1);
        // this.logger.debug(compressedWholeFiles.join(''));
        // this.logger.debug(compressedWholeFiles.join(''));
        const compressed = compressedWholeFiles.join('').split('');
        // this.logger.debug(compressed.join(''));

        const checksum = this.getChecksum(compressed);
        return checksum;
    }

    private parseDiskMap(diskMap: number[]): Block[] {
        let isFile = true;
        let fileId = 0;
        let blocks: Block[] = [];
        for (const digit of diskMap) {
            if (isFile) {
                blocks.push({ isFile: true, id: fileId, length: digit });
                isFile = false;
                fileId++;
            } else {
                blocks.push({ isFile: false, length: digit });
                isFile = true;
            }
        }

        return blocks;
    }

    private generateLayout(blocks: Block[]): string[] {
        let layout: string[] = [];
        for (const block of blocks) {
            if (block.isFile) {
                layout.push(...Array(block.length).fill(block.id?.toString()));
            } else {
                layout.push(...Array(block.length).fill('.'));
            }
        }

        return layout;
    }

    private generateWholeFileLayout(blocks: Block[]): string[] {
        let layout: string[] = [];
        for (const block of blocks) {
            if (block.length > 0) {
                if (block.isFile) {
                    layout.push(Array(block.length).fill(block.id?.toString()).join(''));
                } else {
                    layout.push(Array(block.length).fill('.').join(''));
                }
            }
        }

        return layout;
    }

    private compress(layout: string[]): string[] {
        const compressed = layout.slice();

        for (let i = compressed.length - 1; i >= 0; i--) {
            if (compressed[i] !== '.') {
                const availableMemoryIndex = this.findFirstAvailableMemoryIndex(compressed);

                compressed[availableMemoryIndex] = compressed[i];
                compressed[i] = '.';

                if (!compressed.slice(0, i).includes('.')) {
                    break;
                }
            }
        }

        return compressed;
    }

    private compressWholeFiles(layout: string[], startIndex: number): string[] {
        if (!layout[startIndex].startsWith('.')) {
            const availableMemoryIndex = this.findFirstAvailableMemoryIndexForLength(layout, layout[startIndex].length);
            if (availableMemoryIndex >= 0 && availableMemoryIndex <= startIndex) {
                const memoryBlockLength = layout[availableMemoryIndex].length;

                if (memoryBlockLength === layout[startIndex].length) {
                    layout[availableMemoryIndex] = layout[startIndex];
                    layout[startIndex] = Array(layout[startIndex].length).fill('.').join('');
                } else if (memoryBlockLength > layout[startIndex].length) {
                    const memoryBlock = String(layout[availableMemoryIndex]);
                    const fileBlock = String(layout[startIndex]);

                    layout[availableMemoryIndex] = fileBlock;
                    layout.splice(availableMemoryIndex + 1, 0, memoryBlock.slice(fileBlock.length));
                    layout.splice(startIndex + 1, 1, Array(fileBlock.length).fill('.').join(''));
                }
            }
        }

        --startIndex;
        if (startIndex >= 0) {
            layout = this.compressWholeFiles(layout, startIndex);
        }

        return layout;
    }

    private findBlockStartIndex(startIndex: number, id: string, layout: string[]): number {
        let index = 0;
        for (let i = startIndex; i >= 0; i--) {
            index = i;
            if (layout[i] !== id) {
                break;
            }
        }
        return index;
    }

    private findFirstAvailableMemoryIndex(compressed: string[]): number {
        let index = 0;
        for (let i = 0; i < compressed.length; i++) {
            if (compressed[i] === '.') {
                index = i;
                break;
            }
        }

        return index;
    }

    private findFirstAvailableMemoryIndexForLength(layout: string[], length: number): number {
        let index = -1;
        for (let i = 0; i < layout.length; i++) {
            if (layout[i].startsWith('.')) {
                if (layout[i].length >= length) {
                    index = i;
                    break;
                }
            }
        }

        return index;
    }

    private getMemoryBlockLength(input: string[], start: number): number {
        let length = 0;
        for (let i = start; i < input.length; i++) {
            if (input[i] !== '.') {
                break;
            }

            length++;
        }

        return length;
    }

    private getChecksum(compressed: string[]): bigint {
        let checksum = 0n;
        for (let i = 0; i < compressed.length; i++) {
            if (!compressed[i].startsWith('.')) {
                const parsed = parseInt(compressed[i]);
                try {
                    checksum += BigInt(i) * BigInt(parsed);
                } catch (e) {
                    this.logger.error(e);
                }
            }
        }
        return checksum;
    }
}
