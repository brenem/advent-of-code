export interface ResultWithStats<T> {
    result: T;
    startTime: number;
    endTime: number;
    executionTime: number;
}