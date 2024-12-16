import { Challenge } from '../challenge';

export class Day5 extends Challenge {    
    async part1(input: string): Promise<number | bigint> {
        const [rulesStr, updatesStr] = this.dataLoader.readLines(input, line => line, /\n\s*\n/g);
        const rules = this.dataLoader.readLines(rulesStr, line => line.split('|').map(x => parseInt(x)));
        const updates = this.dataLoader.readLines(updatesStr, line => line.split(',').map(x => parseInt(x)));

        const validUpdates = this.findValidUpdates(rules, updates);
        const middleSum = this.getMiddleSum(validUpdates);

        return BigInt(middleSum);
    }

    async part2(input: string): Promise<number | bigint> {
        const [rulesStr, updatesStr] = this.dataLoader.readLines(input, line => line, /\n\s*\n/g);
        const rules = this.dataLoader.readLines(rulesStr, line => line.split('|').map(x => parseInt(x)));
        const updates = this.dataLoader.readLines(updatesStr, line => line.split(',').map(x => parseInt(x)));

        const validUpdates = this.findValidUpdates(rules, updates);
        let invalidUpdates = updates.filter(x => !validUpdates.includes(x));
        
        const correctedUpdates = this.correctUpdates(rules, invalidUpdates);

        const middleSum = this.getMiddleSum(correctedUpdates);

        return BigInt(middleSum);
    }

    private findValidUpdates(rules: number[][], updates: number[][]): number[][] {
        const validUpdates: number[][] = [];
        for (let i = 0; i < updates.length; i++) {
            let valid = true;
            for (let j = 0; j < updates[i].length; j++) {
                const a = updates[i][j];
                for (let k = j + 1; k < updates[i].length; k++) {
                    const b = updates[i][k];
                    if (rules.find(x => x[0] === b && x[1] === a)) {
                        valid = false;
                        break;
                    }
                }

                if (!valid) {
                    break;
                }
            }

            if (valid) {
                validUpdates.push(updates[i]);
            }
        }
        return validUpdates;
    }

    private getMiddleSum(updates: number[][]): number {
        let middleSum = 0;
        updates.forEach(update => {
            const middleNumber = update[Math.round((update.length - 1) / 2)];
            middleSum += middleNumber;
        });
        return middleSum;
    }

    private correctUpdates(rules: number[][], updates: number[][]): number[][] {
        const correctedUpdates: number[][] = [];

        for (let i = 0; i < updates.length; i++) {
            const correctedUpdate = updates[i].slice();
            let correctionFound = false;
            for (let j = 0; j < updates[i].length; j++) {
                const a = updates[i][j];
                for (let k = j + 1; k < updates[i].length; k++) {
                    const b = updates[i][k];
                    if (rules.find(x => x[0] === b && x[1] === a)) {
                        correctedUpdate[j] = b;
                        correctedUpdate[k] = a;
                        correctionFound = true;
                        break;
                    }
                }

                if (correctionFound) {
                    break;
                }
            }

            correctedUpdates.push(correctedUpdate);
        }

        const validUpdates = this.findValidUpdates(rules, correctedUpdates);
        if (validUpdates.length === correctedUpdates.length) {
            return validUpdates;
        }

        return this.correctUpdates(rules, correctedUpdates);
    }
}