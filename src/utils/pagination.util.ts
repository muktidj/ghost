export const paginationUtil = (
  page: string | null,
  limit: string | null
): {
  currentPage: number;
  offset: number;
  take: number;
} => {
  const take = Number(limit || 10);
  const currentPage = Number(page || 1) - 1;
  const offset: number = currentPage * take;

  return {
    take,
    offset,
    currentPage
  };
};
