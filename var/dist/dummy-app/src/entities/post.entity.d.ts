import { UserEntity } from './user.entity';
export declare class PostEntity {
    id: string;
    title: string;
    content: string;
    user: UserEntity;
}
