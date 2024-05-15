import { UserEntity } from '@core/domain/entities/auth/user.entity';
import { EntitySchema } from 'typeorm';

export const UserSchema = new EntitySchema<UserEntity>({
  name: 'user',
  target: UserEntity,
  tableName: 'users',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    fullname: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
  },
  relations: {
    tasks: {
      type: 'one-to-many',
      target: 'TaskEntity',
      inverseSide: 'user',
      eager: true,
    },
  },
});
