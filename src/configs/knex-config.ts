import Knex from 'knex';
import knexConfig from './../knexfile';
import { Model, knexSnakeCaseMappers } from 'objection';

const runKnexConfig = () => {
  // Initialize knex.
  const knex = Knex({
    ...knexConfig.development,
    ...knexSnakeCaseMappers(),
  });

  Model.knex(knex);
};

export { runKnexConfig };
