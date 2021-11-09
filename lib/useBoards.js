import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function useBoards(url) {
  const { data, error } = useSWR(url, fetcher, { refreshInterval: 2000 });

  return {
    boards: data,
    boardsLoading: !error && !data,
    isError: error,
  };
}
