import { Challenge } from '../challenge';
import { LinkedList } from '../../models/linked-list';

export class Day2 extends Challenge {
    async part1(input: string): Promise<number | bigint> {
        const inputData = this.dataLoader.readLines(input, (line) => line.split(' ').map((n) => parseInt(n)));
        const data: LinkedList<number>[] = [];
        
        inputData.forEach((report) => {
            const linkedList = new LinkedList<number>();
            report.forEach((n) => linkedList.append(n));
            data.push(linkedList);
        });

        let safeReports = 0;
        for (let i = 0; i < data.length; i++) {
            if (this.isReportSafe(data[i])) {
                safeReports++;
            }
        }

        return safeReports;
    }

    async part2(input: string): Promise<number | bigint> {
        const inputData = this.dataLoader.readLines(input, (line) => line.split(' ').map((n) => parseInt(n)));
        const data: LinkedList<number>[] = [];
        
        inputData.forEach((report) => {
            const linkedList = new LinkedList<number>();
            report.forEach((n) => linkedList.append(n));
            data.push(linkedList);
        });

        let safeReports = 0;
        for (let i = 0; i < data.length; i++) {
            if (this.isReportSafe(data[i], true)) {
                safeReports++;
            }
        }

        return safeReports;
    }

    private isReportSafe(report: LinkedList<number>, withLevelRemoval = false): boolean {
        let current = report.head;
        let prevIncreasing: boolean | undefined = undefined;
        let prevDecreasing: boolean | undefined = undefined;
        let increasing = false;
        let decreasing = false;

        let safe = true;
        while (current && current.next) {
            if (current.value === current.next.value) {
                safe = false;
                break;
            }

            const diff = Math.abs(current.value - current.next.value);
            if (diff > 3) {
                safe = false;
                break;
            }

            if (current.value < current.next.value) {
                increasing = true;
                decreasing = false;
            } else if (current.value > current.next.value) {
                increasing = false;
                decreasing = true;
            }

            if (prevIncreasing && increasing !== prevIncreasing) {
                safe = false;
                break;
            } else if (prevDecreasing && decreasing !== prevDecreasing) {
                safe = false;
                break;
            }

            prevIncreasing = increasing;
            prevDecreasing = decreasing;

            current = current.next;
        }

        if (!safe && withLevelRemoval) {
            for (let i = 0; i < report.count(); i++) {
                const newList = new LinkedList<number>();
                let temp = report.head;
                for (let j = 0; j < report.count(); j++) {
                    if (j !== i) {
                        newList.append(temp!.value);
                    }
                    temp = temp!.next;
                }
                if (this.isReportSafe(newList)) {
                    safe = true;
                    break;
                }
            }

        }
        return safe;
    }
}
