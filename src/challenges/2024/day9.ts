import { Challenge } from '../challenge';
import { Container } from 'typedi';
import { FileHandler } from '../../services/file-handler';

interface Block {
    isFile: boolean;
    id?: number;
    length: number;
}

type FreeSpace = '.';
type FileId = number;
type DiskRepresentation = (FreeSpace | FileId)[];

export class Day9 extends Challenge {
    async part1(input: string): Promise<number | bigint> {
        const diskMap = this.dataLoader.readLines(input, (line) => line.split('').map(Number))[0];

        const blocks = this.parseDiskMap(diskMap);
        const layout = this.generateLayout(blocks);
        const compressed = this.compress(layout);
        const checksum = this.getChecksum(compressed);

        return checksum;
    }

    async part2(input: string): Promise<number | bigint> {
        const diskMap = this.dataLoader.readLines(input, (line) => line.split('').map(Number))[0];

        let disk = this.transformDiskMapToDisk(diskMap);
        disk = this.compressWholeFiles(diskMap, disk);
        const checksum = this.calculateChecksum(disk);
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

    private howManyFilesWithId(disk: DiskRepresentation, currentIndex: number): number {
        let count = 1;
    
        let j = currentIndex + 1;
    
        while (disk[j] === disk[currentIndex]) {
            count++;
            j++;
        }
    
        return count;
    }

    private transformDiskMapToDisk(diskMapInput: number[]): DiskRepresentation {
        return diskMapInput.flatMap((number, currentIndex) => {
                return Array(number).fill(currentIndex % 2 === 0 ? Number(currentIndex) / 2 : ".");
            }
        );
    }

    private compressWholeFiles(diskMap: number[], disk: DiskRepresentation): DiskRepresentation {
        for (let num = Math.ceil(diskMap.length / 2) - 1; num >= 0; num--) {
            const idStartIndex = disk.indexOf(num),
                filesCount = this.howManyFilesWithId(disk, idStartIndex);
    
            for (let j = 0; j < idStartIndex; j++) {
                if (disk[j] === "." && this.howManyFilesWithId(disk, j) >= filesCount) {
                    disk.splice(idStartIndex, filesCount, ...Array(filesCount).fill("."));
                    disk.splice(j, filesCount, ...Array(filesCount).fill(num));
    
                    break;
                }
            }
        }

        return disk;
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

    private calculateChecksum(disk: (FreeSpace | FileId)[]): number {
        return disk.reduce((previousSum, currentNumber, currentFileId) => {
            return currentNumber === "." ? previousSum : Number(previousSum) + Number(currentNumber) * Number(currentFileId);
        }, 0) as number;
    }
}
