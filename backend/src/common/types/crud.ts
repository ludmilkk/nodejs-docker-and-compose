import {
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
} from 'typeorm';

export type QueryFilter<T> =
  | FindOptionsWhere<T>
  | FindOptionsWhere<T>[]
  | undefined;

export interface CrudOptions<T> {
  relations?: FindOptionsRelations<T>;
  select?: FindOptionsSelect<T>;
  order?: FindOptionsOrder<T>;
  withProtectedFields?: boolean;
}
