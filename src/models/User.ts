import { Model } from 'objection';

class User extends Model {
  static get tableName() {
    return 'users';
  }

  static get idColumn() {
    return 'userId';
  }

  userId!: string;
  password!: string;
  username!: string;
  name!: string;
  createdAt!: string;
  updatedAt!: string;
}

export { User };
