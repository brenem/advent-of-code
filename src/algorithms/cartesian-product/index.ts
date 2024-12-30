type UnwrapArray<T> = T extends ReadonlyArray<infer E> ? E : T;
type MakeArray<T> = T extends readonly any[] ? T : readonly [T];
type Concat<T> = T extends readonly [infer F, ...infer R] ? [...Extract<F, readonly any[]>, ...Concat<R>] : [];

type CartesianProduct<T extends readonly any[]> = number extends
    | T['length']
    | { [K in keyof T]: MakeArray<T[K]>['length'] }[number]
    ? Array<{ [K in keyof T]: UnwrapArray<T[K]> }>
    : _CartProd<T>;

type _CartProd<T extends readonly any[]> = T extends readonly [infer F, ...infer R]
    ? [MakeArray<F>, _CartProd<R>] extends [infer AF, infer CR]
        ? Concat<{
              [I in keyof AF]: {
                  [J in keyof CR]: [AF[I], ...Extract<CR[J], readonly any[]>];
              };
          }>
        : never
    : [[]];

type Narrowable = string | number | boolean | symbol | object | undefined | void | null | [] | readonly [] | {};

function cartesianProduct<T extends (N | N[])[], N extends Narrowable>(...args: T): CartesianProduct<T> {
    if (!args.length) return [[]] as any;
    const [arg1, ...rest] = args;
    return (Array.isArray(arg1) ? arg1 : [arg1]).flatMap((e) => cartesianProduct(...rest).map((x) => [e, ...x])) as any;
}

export default cartesianProduct;