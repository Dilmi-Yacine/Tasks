import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function useLists(url) {
  const { data, error } = useSWR(url, fetcher);

  return {
    user: data,
    loadingUser: !error && !data,
    isError: error,
  };
}
