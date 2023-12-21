import { useQuery, useMutation } from 'react-query';

async function fetchComments(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
  );
  return response.json();
}

async function deletePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: 'DELETE' }
  );
  return response.json();
}

async function updatePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: 'PATCH', data: { title: 'REACT QUERY FOREVER!!!!' } }
  );
  return response.json();
}

export function PostDetail({ post }) {
  const { data, isLoading, isError, error } = useQuery(
    ['comment', post.id],
    () => fetchComments(post.id)
  );

  const {
    mutate: deletePostMutate,
    isError: deletePostError,
    isLoading: isDeletingPost,
  } = useMutation((postId) => deletePost(postId));

  const {
    mutate: updatePostMutate,
    isError: updatePostError,
    isLoading: isUpdating,
  } = useMutation((postId) => updatePost(postId));

  if (isLoading) return <h3>Loading...</h3>;
  if (isError) return <div>Something went wrong {error.toString()}</div>;

  return (
    <>
      <h3 style={{ color: 'blue' }}>{post.title}</h3>
      <button onClick={() => deletePostMutate(post.id)}>Delete</button>{' '}
      {deletePostError && (
        <div style={{ color: 'red' }}>Error deleting post</div>
      )}
      {isDeletingPost && <div style={{ color: 'red' }}>Deleting Post</div>}
      {/*  */}
      <button onClick={() => updatePostMutate(post.id)}>Update title</button>
      {updatePostError && (
        <div style={{ color: 'red' }}>Error deleting post</div>
      )}
      {isUpdating && <div style={{ color: 'red' }}>Deleting Post</div>}
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
