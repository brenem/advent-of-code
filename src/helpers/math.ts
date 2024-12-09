import { evaluate } from 'mathjs';

export const evaluateExpression = (expression: string): number => {
    try {
        return evaluate(expression);
    } catch (error) {
        throw new Error(`Invalid mathematical expression: ${expression}`);
    }
}