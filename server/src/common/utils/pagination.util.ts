import { PaginatedResponseDto, PaginationMetaDto } from '../dto/paginated-response.dto';

export const buildPaginatedResponse = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedResponseDto<T> => {
  const normalizedLimit = limit > 0 ? limit : total;
  const totalPages = normalizedLimit ? Math.ceil(total / normalizedLimit) : 1;

  const meta: PaginationMetaDto = {
    totalItems: total,
    totalPages,
    currentPage: page,
    limit: normalizedLimit,
  };

  return {
    data,
    meta,
  };
};

