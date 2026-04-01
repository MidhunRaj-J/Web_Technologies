export default function PostList({ posts }) {
  return (
    <ul className="post-list">
      {posts.map((post) => (
        <li key={post.id} className="post-card">
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </li>
      ))}
    </ul>
  );
}
