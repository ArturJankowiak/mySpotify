import { apiRoutes } from "./apiRoutes";

export const getUrl = (url, query) => {
  let queryUrl = "?";
  for (const [key, value, i] of Object.entries(query)) {
    queryUrl += `${key}=${value}&`;
  }
  return apiRoutes.root + url + queryUrl;
};
