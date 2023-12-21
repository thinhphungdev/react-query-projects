import { useEffect } from 'react';
import { useQueryClient } from 'react-query';

export function usePrefetch(queryKeyString, currentPage, maxPage) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (currentPage > maxPage) return;

    const nextPage = currentPage + 1;

    queryClient.prefetchQuery({ queryKey: [queryKeyString, nextPage] });
  }, [currentPage, maxPage, queryClient, queryKeyString]);
}
