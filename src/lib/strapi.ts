import qs from "qs";

interface Props {
  endpoint: string;
  query?: Record<string, string>;
  populate?: Record<string, boolean>;
}

/**
 * Fetches data from the Strapi API
 * @param endpoint - The endpoint to fetch from
 * @param query - The query parameters to add to the url
 *  * @param populate - The fields to populate
 * @returns
 */
export default async function fetchApi<T>({
  endpoint,
  query,
  populate,
}: Props): Promise<T> {
  if (endpoint.startsWith("/")) {
    endpoint = endpoint.slice(1);
  }

  const url = new URL(
    `${import.meta.env.STRAPI_URL}/api/${endpoint}${
      populate ? `?${qs.stringify({ populate }, { encode: false })}` : ""
    }`
  );

  console.log(url.href);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }
  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.STRAPI_TOKEN}`,
    },
  });
  let data = await res.json();

  // * Strapi applys a wrapping to the data to remove
  // sometimes we need a meta but do a specific for that instead of an always
  data = data.data;

  return data as T;
}
