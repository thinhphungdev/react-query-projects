import { useQuery } from 'react-query';
import { useEffect } from 'react';
import { useQueryClient } from 'react-query';

export async function fetchPosts(pageNumber) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pageNumber}`
  );
  return response.json();
}

export const usePost = (currentPage) => {
  return useQuery(['post', currentPage], () => fetchPosts(currentPage), {
    staleTime: 2000,
    keepPreviousData: true,
  });
};

export function usePrefetch(queryKeyString, currentPage, maxPage, prefetchFn) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (currentPage > maxPage) return;

    const nextPage = currentPage + 1;

    queryClient.prefetchQuery({
      queryKey: [queryKeyString, nextPage],
      queryFn: prefetchFn,
    });
  }, [currentPage, maxPage, queryClient, queryKeyString, prefetchFn]);
}
