type Params = { [key: string]: string | null };

export default function constructURL(baseURL: string, params: Params) {
  const url = new URL(baseURL);
  Object.keys(params).forEach(key => {
    if (params[key] !== null) {
      url.searchParams.append(key, params[key]);
    }
  });
  return url;
}