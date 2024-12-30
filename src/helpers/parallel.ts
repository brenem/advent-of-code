async function parallel<T>(arr: T[], fn: (item: T) => void, threads = 2) {
    const result = [];
    while (arr.length) {
        const res = await Promise.all(arr.splice(0, threads).map(x => fn(x)));
        result.push(res);
    }
    return result.flat();
}
