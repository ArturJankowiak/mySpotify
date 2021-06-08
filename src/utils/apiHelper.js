import { apiRoutes } from "./apiRoutes";

export const getUrl = (url, query, filters = null) => {
  let queryUrl = "?";
  if (query) {
    for (const [key, value, i] of Object.entries(query)) {
      queryUrl += `${key}=${value}&`;
    }
  }

  if (filters) {
    const { page, limit } = filters;
    queryUrl += `offset=${page <= 1 ? "0" : page * limit}&limit=${limit}`;
  }
  return apiRoutes.root + url + queryUrl;
};
