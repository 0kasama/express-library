export const pagination = ({ result, count, limit, page }) => {
  const totalPages = Math.ceil(count / limit);

  return {
    data: result,
    pagination: {
      total: +count,
      page,
      limit,
      totalPages,
    },
  };
};
