import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function useBoard(url) {
  const { data, error } = useSWR(url, fetcher, { refreshInterval: 1000 });

  return {
    board: data,
    loadingBoard: !error && !data,
    isError: error,
  };
}
