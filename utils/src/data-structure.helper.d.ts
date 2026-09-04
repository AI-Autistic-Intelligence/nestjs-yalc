export declare const arrayGroupByField: <T, K extends string | number | symbol>(entityArray: T[], getKey: (item: T) => K) => Record<K, T[]>;
