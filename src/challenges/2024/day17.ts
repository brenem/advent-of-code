import { PuzzleResult } from '../../models/puzzle-result';
import { Challenge } from '../challenge';

interface Registers {
    A: number;
    B: number;
    C: number;
}

const instructions: { [key: number]: string } = {
    0: 'adv',
    1: 'bxl',
    2: 'bst',
    3: 'jnz',
    4: 'bxc',
    5: 'out',
    6: 'bdv',
    7: 'cdv'
};

export class Day17 extends Challenge {
    async part1(input: string): Promise<PuzzleResult> {
        const debugInput = this.dataLoader.readLines(input, (line) => line);
        const registers = this.parseRegisters(debugInput);
        const program = this.parseProgram(debugInput);
        const output = this.getProgramOutput(registers, program);

        return output.join(',');
    }

    async part2(input: string): Promise<PuzzleResult> {
        const debugInput = this.dataLoader.readLines(input, (line) => line);
        const program = this.parseProgram(debugInput);
        let registers = this.parseRegisters(debugInput);

        let output: number[] = [];
        let registerA = 1;
        const programString = program.join(',');

        while (true) {
            output = this.getProgramOutput({ A: registerA, B: 0, C: 0 }, program);
            const outputString = output.join(',');

            if (outputString === programString) {
                break;
            }

            if (programString.endsWith(outputString)) {
                registerA = registerA * 8;
            } else {
                registerA++;
            }
        }

        return registerA;;
    }

    private parseRegisters(input: string[]): Registers {
        return {
            A: parseInt(input[0].split(': ')[1]),
            B: parseInt(input[1].split(': ')[1]),
            C: parseInt(input[2].split(': ')[1])
        };
    }

    private parseProgram(input: string[]): number[] {
        return input[3]
            .split(': ')[1]
            .split(',')
            .map((x) => parseInt(x));
    }

    private getProgramOutput(registers: Registers, program: number[]): number[] {
        const output: number[] = [];

        let pointer = 0;
        while (pointer < program.length) {
            const opCode = program[pointer];
            const instruction = instructions[opCode];

            switch (instruction) {
                case 'adv':
                    this.adv(registers, program[pointer + 1]);
                    break;
                case 'bxl':
                    this.bxl(registers, program[pointer + 1]);
                    break;
                case 'bst':
                    this.bst(registers, program[pointer + 1]);
                    break;
                case 'jnz':
                    if (registers.A !== 0) {
                        pointer = program[pointer + 1];
                        continue;
                    }
                    break;
                case 'bxc':
                    this.bxc(registers);
                    break;
                case 'out':
                    output.push(this.out(registers, program[pointer + 1]));
                    break;
                case 'bdv':
                    this.bdv(registers, program[pointer + 1]);
                    break;
                case 'cdv':
                    this.cdv(registers, program[pointer + 1]);
                    break;
            }

            pointer += 2;
        }

        return output;
    }

    private adv(registers: Registers, operand: number): void {
        registers.A = this.dv(registers, operand);
    }

    private bxl(registers: Registers, operand: number): void {
        registers.B = Number(BigInt(registers.B) ^ BigInt(operand));
    }

    private bst(registers: Registers, operand: number): void {
        registers.B = this.calculateComboOperand(registers, operand) & 7;
    }

    private bxc(registers: Registers): void {
        registers.B = Number(BigInt(registers.B) ^ BigInt(registers.C));
    }

    private out(registers: Registers, operand: number): number {
        return this.calculateComboOperand(registers, operand) & 7;
    }

    private bdv(registers: Registers, operand: number): void {
        registers.B = this.dv(registers, operand);
    }

    private cdv(registers: Registers, operand: number): void {
        registers.C = this.dv(registers, operand);
    }

    private dv(registers: Registers, operand: number): number {
        const numerator = registers.A;
        const denominator = 2 ** this.calculateComboOperand(registers, operand);
        return Math.trunc(numerator / denominator);
    }

    private calculateComboOperand(registers: Registers, operand: number) {
        switch (operand) {
            case 4:
                return registers.A;
            case 5:
                return registers.B;
            case 6:
                return registers.C;
            default:
                return operand;
        }
    }
}
