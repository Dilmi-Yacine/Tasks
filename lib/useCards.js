import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function useCards(url) {
  const { data, error } = useSWR(url, fetcher, { refreshInterval: 2000 });

  return {
    cards: data,
    loadingCards: !error && !data,
    isError: error,
  };
}
