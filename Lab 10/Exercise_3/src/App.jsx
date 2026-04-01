import PostList from "./components/PostList";
import useFetchPosts from "./hooks/useFetchPosts";
import "./App.css";

export default function App() {
  const { posts, isLoading, error } = useFetchPosts();

  return (
    <main className="app-shell">
      <section className="content-card">
        <h1>Exercise 3: API Data Fetching in React</h1>
        <p className="subtitle">
          Data is loaded from an external API using useEffect and displayed with
          dynamic list rendering.
        </p>

        {isLoading && <p className="status loading">Loading posts...</p>}

        {!isLoading && error && (
          <p className="status error">Error: {error}</p>
        )}

        {!isLoading && !error && <PostList posts={posts} />}
      </section>
    </main>
  );
}
