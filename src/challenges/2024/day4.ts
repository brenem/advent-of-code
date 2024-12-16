import { LinkedList } from '../../models/linked-list';
import { Challenge } from '../challenge';

export class Day4 extends Challenge {
    async part1(input: string): Promise<number | bigint> {
        const horizonatlRightCount = input.match(/XMAS/g)!.length;
        const horizontalLeftCount = input.match(/SAMX/g)!.length;

        const data = this.dataLoader.readLines(input, (line) => line.split(''));

        let verticalDownCount = 0;
        let verticalUpCount = 0;
        let diagonalDownLeftCount = 0;
        let diagonalDownRightCount = 0;
        let diagonalUpLeftCount = 0;
        let diagonalUpRightCount = 0;

        data.forEach((line, lineIndex) => {
            for (let i = 0; i < line.length; i++) {
                if (line[i] === 'X') {
                    if (data[lineIndex + 1]?.[i] === 'M') {
                        if (data[lineIndex + 2]?.[i] === 'A') {
                            if (data[lineIndex + 3]?.[i] === 'S') {
                                verticalDownCount++;
                            }
                        }
                    }
                }

                if (line[i] === 'S') {
                    if (data[lineIndex + 1]?.[i] === 'A') {
                        if (data[lineIndex + 2]?.[i] === 'M') {
                            if (data[lineIndex + 3]?.[i] === 'X') {
                                verticalUpCount++;
                            }
                        }
                    }
                }

                if (line[i] === 'X') {
                    if (data[lineIndex + 1]?.[i + 1] === 'M') {
                        if (data[lineIndex + 2]?.[i + 2] === 'A') {
                            if (data[lineIndex + 3]?.[i + 3] === 'S') {
                                diagonalDownRightCount++;
                            }
                        }
                    }
                }

                if (line[i] === 'S') {
                    if (data[lineIndex + 1]?.[i + 1] === 'A') {
                        if (data[lineIndex + 2]?.[i + 2] === 'M') {
                            if (data[lineIndex + 3]?.[i + 3] === 'X') {
                                diagonalUpLeftCount++;
                            }
                        }
                    }
                }

                if (line[i] === 'X') {
                    if (data[lineIndex + 1]?.[i - 1] === 'M') {
                        if (data[lineIndex + 2]?.[i - 2] === 'A') {
                            if (data[lineIndex + 3]?.[i - 3] === 'S') {
                                diagonalDownLeftCount++;
                            }
                        }
                    }
                }

                if (line[i] === 'S') {
                    if (data[lineIndex + 1]?.[i - 1] === 'A') {
                        if (data[lineIndex + 2]?.[i - 2] === 'M') {
                            if (data[lineIndex + 3]?.[i - 3] === 'X') {
                                diagonalUpRightCount++;
                            }
                        }
                    }
                }
            }
        });

        return BigInt(
            horizonatlRightCount +
            horizontalLeftCount +
            verticalDownCount +
            verticalUpCount +
            diagonalDownLeftCount +
            diagonalDownRightCount +
            diagonalUpLeftCount +
            diagonalUpRightCount
        );
    }

    async part2(input: string): Promise<number | bigint> {
        const data = this.dataLoader.readLines(input, (line) => line.split(''));

        let x_masCount = 0;
        data.forEach((line, lineIndex) => {
            for (let i = 0; i < line.length; i++) {
                if (line[i] === 'M' || line[i] === 'S') {
                    if (data[lineIndex + 1]?.[i + 1] === 'A') {
                        if (data[lineIndex + 2]?.[i + 2] === 'M' || data[lineIndex + 2]?.[i + 2] === 'S') {
                            if (line[i + 2] === 'M' || line[i + 2] === 'S') {
                                if (data[lineIndex + 1]?.[i + 1] === 'A') {
                                    if (data[lineIndex + 2]?.[i] === 'M' || data[lineIndex + 2]?.[i] === 'S') {
                                        if (
                                            line[i] === data[lineIndex + 2]?.[i + 2] ||
                                            line[i + 2] === data[lineIndex + 2]?.[i]
                                        )
                                            continue;

                                        x_masCount++;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        return BigInt(x_masCount);
    }
}
