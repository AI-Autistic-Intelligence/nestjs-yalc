import { PostEntity } from './post.entity';
export declare class UserEntity {
    id: string;
    firstName: string;
    lastName: string;
    balance: string;
    age: number;
    posts?: PostEntity[];
}
