import { Point } from '../../models/point';
import { Challenge } from '../challenge';

interface ButtonPrizeConfig {
    buttonA: Point;
    buttonB: Point;
    prize: Point;
}

export class Day13 extends Challenge {
    async part1(input: string): Promise<number | bigint> {
        const buttonsAndPrizes = this.dataLoader.readLines(input, (line) => line, /\n\s*\n/g);
        const configs = this.parseConfigs(buttonsAndPrizes);
        const tokens = this.calculateTokens(configs);

        return tokens;
    }

    async part2(input: string): Promise<number | bigint> {
        const buttonsAndPrizes = this.dataLoader.readLines(input, (line) => line, /\n\s*\n/g);
        const configs = this.parseConfigs(buttonsAndPrizes);
        const tokens = this.calculateTokens(configs, 10000000000000);

        return tokens;
    }

    private parseConfigs(buttonsAndPrizes: string[]): ButtonPrizeConfig[] {
        return buttonsAndPrizes.map((line) => {
            const configs = line.split('\n');
            const buttonAConfig = configs[0].split(': ')[1];
            const buttonBConfig = configs[1].split(': ')[1];
            const prizeConfig = configs[2].split(': ')[1];

            const buttonA: Point = {
                x: parseInt(buttonAConfig.split(', ')[0].split('+')[1]),
                y: parseInt(buttonAConfig.split(', ')[1].split('+')[1])
            };
            const buttonB: Point = {
                x: parseInt(buttonBConfig.split(', ')[0].split('+')[1]),
                y: parseInt(buttonBConfig.split(', ')[1].split('+')[1])
            };
            const prize: Point = {
                x: parseInt(prizeConfig.split(', ')[0].split('=')[1]),
                y: parseInt(prizeConfig.split(', ')[1].split('=')[1])
            };

            return {
                buttonA,
                buttonB,
                prize
            } as ButtonPrizeConfig;
        });
    }

    private calculateTokens(configs: ButtonPrizeConfig[], padding = 0): number {
        let tokens = 0;
        for (const config of configs) {
            const py = config.prize.y + padding;
            const px = config.prize.x + padding;
            const ax = config.buttonA.x;
            const ay = config.buttonA.y;
            const by = config.buttonB.y;
            const bx = config.buttonB.x;

            let bTimes = (py * ax - px * ay) / (by * ax - bx * ay);
            let aTimes = (px - bTimes * bx) / ax;

            bTimes = Math.round(Math.abs(bTimes));
            aTimes = Math.round(Math.abs(aTimes));

            if (padding === 0 && (aTimes > 100 || bTimes > 100)) {
                continue;
            }

            let xPrize = aTimes * ax + bTimes * bx;
            let yPrize = aTimes * ay + bTimes * by;

            if (padding !== 0) {
                xPrize = Math.round(xPrize);
                yPrize = Math.round(yPrize);
            }

            if (xPrize === px && yPrize === py) {
                const aTokens = aTimes * 3;
                const bToken = bTimes * 1;
                const totalTokens = aTokens + bToken;

                tokens += totalTokens;
            }
        }

        return tokens;
    }
}
