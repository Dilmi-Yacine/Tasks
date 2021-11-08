import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function useLabels(url) {
  const { data, error } = useSWR(url, fetcher, { refreshInterval: 1000 });

  return {
    labels: data,
    loadingLabels: !error && !data,
    isError: error,
  };
}
