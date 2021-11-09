import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function useLists(url) {
  const { data, error } = useSWR(url, fetcher, { refreshInterval: 2000 });

  return {
    lists: data,
    loadingLists: !error && !data,
    isError: error,
  };
}
