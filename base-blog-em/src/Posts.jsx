import { useState } from 'react';

import { PostDetail } from './PostDetail';
import { usePrefetch } from './queries';
import { fetchPosts, usePost } from './queries';
const maxPostPage = 10;

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  const { data, isLoading, isError, error } = usePost(currentPage);

  usePrefetch('post', currentPage, maxPostPage, () =>
    fetchPosts(currentPage + 1)
  );

  if (isLoading) return <h3>Loading...</h3>;
  if (isError) return <div>Something went wrong {error.toString()}</div>;

  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className='post-title'
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className='pages'>
        <button
          disabled={currentPage <= 1}
          onClick={() => setCurrentPage((prevPage) => prevPage - 1)}
        >
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button
          disabled={currentPage >= maxPostPage}
          onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
        >
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
