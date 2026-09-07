import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserEntity } from '../../entities/user.entity';
import { UserService } from './user.service';
import { AgGridArgs } from '@nest-yalc-2/ag-grid/ag-grid-args.decorator';
import { AgGridFindManyOptions } from '@nest-yalc-2/ag-grid/ag-grid.interface';
import { GqlError } from '@nest-yalc-2/graphql/plugins/gql.error';

@Resolver((): typeof UserEntity => UserEntity)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query((): (typeof UserEntity)[] => [UserEntity])
  getUsers(
    @AgGridArgs({ entityType: UserEntity })
    agGridArgs: AgGridFindManyOptions<UserEntity>,
  ): Promise<UserEntity[]> {
    return this.userService.getEntityListAgGrid(agGridArgs);
  }

  @Query((): StringConstructor => String)
  throwError(): string {
    throw new GqlError('Intentional error for testing', 'TEST_ERROR');
  }

  @Mutation((): typeof UserEntity => UserEntity)
  async createUser(
    @Args('firstName') firstName: string,
    @Args('lastName') lastName: string,
    @Args('balance') balance: string,
    @Args('age') age: number,
  ): Promise<UserEntity> {
    return this.userService.userRepository.save({
      firstName,
      lastName,
      balance,
      age,
    });
  }
}
