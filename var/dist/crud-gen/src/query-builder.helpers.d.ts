import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
declare module 'typeorm' {
    interface SelectQueryBuilder<Entity> {
        getMany(this: SelectQueryBuilder<Entity>): Promise<Entity[]>;
        getOne(this: SelectQueryBuilder<Entity>): Promise<Entity | undefined>;
    }
}
export declare class SelectQueryBuilderPatched<T extends ObjectLiteral> extends SelectQueryBuilder<T> {
}
