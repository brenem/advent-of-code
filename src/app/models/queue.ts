export interface IQueue<T> {
    enqueue(item: T): void;
    dequeue(): T | undefined;
    size(): number;
}

export class Queue<T> implements IQueue<T> {
    private storage:    T[] = [];

    constructor(private capacity: number = Infinity) {
        this.storage = [];
    }

    public enqueue(item: T): void {
        if (this.size() === this.capacity) {
            throw Error('Queue has reached max capacity, you cannot add more items');
        }

        this.storage.push(item);
    }

    public dequeue(): T | undefined {
        return this.storage.shift();
    }

    public size(): number {
        return this.storage.length;
    }
}