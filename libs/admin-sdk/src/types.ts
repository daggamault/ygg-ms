export type PaginationReq = {
  page?: number;
  limit?: number;
};

export type PaginatedRes<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
};
