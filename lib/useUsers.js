import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function useLists(url) {
  const { data, error } = useSWR(url, fetcher, { refreshInterval: 1000 });

  return {
    users: data,
    loadingUsers: !error && !data,
    isError: error,
  };
}
