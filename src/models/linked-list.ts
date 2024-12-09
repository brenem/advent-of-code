export class LinkedNode<T> {
    value: T;
    next: LinkedNode<T> | null = null;

    constructor(value: T) {
        this.value = value;
    }
}

export class LinkedList<T> {
    head: LinkedNode<T> | null = null;

    append(value: T): void {
        const newNode = new LinkedNode(value);
        if (!this.head) {
            this.head = newNode;
            return;
        }

        let current = this.head;
        while (current.next) {
            current = current.next;
        }
        current.next = newNode;
    }

    prepend(value: T): void {
        const newNode = new LinkedNode(value);
        newNode.next = this.head;
        this.head = newNode;
    }

    delete(value: T): void {
        if (!this.head) {
            return;
        }

        if (this.head.value === value) {
            this.head = this.head.next;
            return;
        }

        let current = this.head;
        while (current.next && current.next.value !== value) {
            current = current.next;
        }

        if (current.next) {
            current.next = current.next.next;
        }
    }

    find(value: T): LinkedNode<T> | null {
        let current = this.head;
        while (current && current.value !== value) {
            current = current.next;
        }
        return current;
    }

    count(): number {
        let count = 0;
        let current = this.head;
        while (current) {
            count++;
            current = current.next;
        }
        return count;
    }

    print(): void {
        let current = this.head;
        while (current) {
            console.log(current.value);
            current = current.next;
        }
    }

    toString(): string {
        let current = this.head;
        let nums: T[] = [];
        while (current) {
            nums.push(current.value);
            current = current.next;
        }
        return nums.join(' ');
    }
}
