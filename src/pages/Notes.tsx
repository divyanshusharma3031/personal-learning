// src/pages/Notes.tsx

import BlogCard from "../components/BlogCard";
import { getAllPosts } from "../lib/blog";

export default function Notes() {
  const posts = getAllPosts();

  return (
    <>
      <h1 className="text-4xl font-bold">
        Notes
      </h1>

      <p className="mt-2 text-zinc-400">
        My learning journal and technical notes.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {posts.map((post) => (
          <BlogCard
            key={post.slug}
            post={post}
          />
        ))}
      </div>
    </>
  );
}