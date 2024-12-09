import { Challenge } from '../challenge';

interface Equation {
    answer: number;
    numbers: number[];
}

export class Day7 extends Challenge {
    async part1(input: string): Promise<number> {
        const equations = this.parseInput(input);
        const trueEquations = this.getTrueEquations(equations);
        const answers = trueEquations.map((x) => x.answer);
        return answers.reduce((acc, curr) => acc + curr, 0);
    }

    async part2(input: string): Promise<number> {
        const equations = this.parseInput(input);
        const trueEquations = this.getTrueEquations(equations);
        const answersBeforeElephants = trueEquations.map((x) => x.answer);
        const trueEquationsWithElephants = this.getTrueEquations(equations, true);
        const answersWithElephants = trueEquationsWithElephants.map((x) => x.answer);
        const uniqueAnswers = [...new Set([...answersBeforeElephants, ...answersWithElephants])];
        return uniqueAnswers.reduce((acc, curr) => acc + curr, 0);
    }

    private parseInput(input: string): Equation[] {
        const equations = this.dataLoader.readLines(input, (line) => {
            const parts = line.split(':');
            return {
                answer: parseInt(parts[0].trim()),
                numbers: parts[1]
                    .trim()
                    .split(' ')
                    .map((x) => parseInt(x.trim()))
            } as Equation;
        });

        return equations;
    }

    private getTrueEquations(equations: Equation[], hasElephants: boolean = false): Equation[] {
        const trueEquations: Equation[] = [];
        for (const equation of equations) {
            if (this.hasTruth(equation, hasElephants)) {
                trueEquations.push(equation);
            }
        }

        return trueEquations;
    }

    private hasTruth(equation: Equation, hasElephants: boolean): boolean {
        let operators = ['+', '*'];
        if (hasElephants) {
            operators = ['*', '+', '||'];
        }

        let expressions = this.getCombinations(operators, equation.numbers);

        for (const expression of expressions) {
            if (this.evaluateLeftToRight(expression) === equation.answer) {
                return true;
            }
        }

        return false;
    }

    private evaluateLeftToRight(expression: string): number {
        let currentResult = 0;

        const applyOperation = (num1: number, num2: number, operator: string): number => {
            switch (operator) {
                case '+':
                    return num1 + num2;
                case '*':
                    return num1 * num2;
                case '||':
                    return parseInt(num1.toString() + num2.toString());
                default:
                    throw new Error(`Invalid operator: ${operator}`);
            }
        };

        const tokens = expression.match(/(\d+|[+*]|\|{2})/g);
        if (!tokens) {
            throw new Error('Invalid expression');
        }

        currentResult = parseInt(tokens[0]);

        for (let i = 1; i < tokens.length; i += 2) {
            const operator = tokens[i];
            const nextNumber = parseInt(tokens[i + 1]);
            currentResult = applyOperation(currentResult, nextNumber, operator);
        }

        return currentResult;
    }

    private getCombinations(operators: string[], numbers: number[]): string[] {
        if (numbers.length < 2) {
            throw new Error('The numbers array must have at least 2 elements');
        }

        const result: string[] = [];
        const numOperators = numbers.length - 1;

        // Helper function to recursively build expressions
        const backtrack = (expression: string[], depth: number) => {
            if (depth === numOperators) {
                result.push(expression.join(''));
                return;
            }

            for (const op of operators) {
                expression.push(op, numbers[depth + 1].toString());
                backtrack(expression, depth + 1);
                expression.pop(); // Remove the number
                expression.pop(); // Remove the operator
            }
        };

        backtrack([numbers[0].toString()], 0);

        return result;
    }
}
