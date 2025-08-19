import { paginator, PaginatorTypes } from '@nodeteam/nestjs-prisma-pagination';

export const paginate: PaginatorTypes.PaginateFunction = paginator({
  page: 1,
  perPage: 25,
});
