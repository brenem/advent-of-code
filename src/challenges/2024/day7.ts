import { evaluateExpression } from '../../helpers/math';
import { Challenge } from '../challenge';

interface Equation {
    answer: number;
    numbers: number[];
}

export class Day7 extends Challenge {
    async part1(input: string): Promise<number> {
        const equations = this.dataLoader.readLines(input, (line) => {
            const parts = line.split(':');
            return {
                answer: parseInt(parts[0].trim()),
                numbers: parts[1].trim().split(' ').map((x) => parseInt(x.trim())),
            } as Equation;
        });

        let answerSum = 0;
        for (const equation of equations) {
            if (this.hasTruth(equation)) {
                answerSum += equation.answer;
            }
        }

        return answerSum;
    }

    async part2(input: string): Promise<number> {
        return 0;
    }

    private hasTruth(equation: Equation): boolean {
        const expressions = this.getCombinations(['+', '*'], equation.numbers);
        for (const expression of expressions) {
            if (evaluateExpression(expression) === equation.answer) {
                return true;
            }
        }

        return false;
    }

    private getCombinations(operators: string[], numbers: number[]): string[] {
        const equations: string[] = [];

        while (equations.length < (operators.length - 1) * 2) {
            let equation = '';
            for (let i = 0; i < operators.length; i++) {
                for (let j = 0; j < numbers.length - 1; j++) {
                    equation += `${numbers[j]} ${operators[i]} ${numbers[j + 1]}`;
                }

                equations.push(equation);
                console.log(equation);
            }
        }

        return equations;
    }
}
