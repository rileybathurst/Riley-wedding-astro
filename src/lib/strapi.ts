interface Props {
  endpoint: string;
  query?: Record<string, string>;
  populate?: Record<string, boolean>;
}

/**
 * Fetches data from the Strapi API
 * @param endpoint - The endpoint to fetch from
 * @param query - The query parameters to add to the url
 * @param populate - The fields to populate
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

  // this is the format I need
  // http://45.79.101.19:1347/api/couples?populate[1]=hero&populate[2]=collaborators
  // console.log(qs.stringify(populate));

  // Convert populate object to array query string: populate[1]=hero&populate[2]=collaborators
  var populateParams = "";
  if (populate) {
    populateParams = Object.keys(populate)
      .map((key, idx) => `populate[${idx + 1}]=${key}`)
      .join("&");
  }

  // console.log(populateParams);

  // populate ? `?${qs.stringify({ populate }, { encode: false })}` : ""}
  const url = new URL(
    `${import.meta.env.STRAPI_URL}/api/${endpoint}${
      populateParams ? `?${populateParams}` : ""
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
