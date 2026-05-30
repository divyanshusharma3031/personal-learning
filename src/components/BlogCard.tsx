import { Link } from "react-router-dom";
import type { BlogPost } from "../types/blog";

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({
  post,
}: BlogCardProps) {
  return (
    <Link
      to={`/notes/${post.category}/${post.slug}`}
      className="block rounded-xl border border-zinc-800 p-5 transition hover:border-zinc-600"
    >
      <p className="text-sm text-zinc-500">
        {post.category}
      </p>

      <h3 className="mt-2 text-lg font-semibold">
        {post.title}
      </h3>

      <p className="mt-2 text-zinc-400">
        {post.summary}
      </p>
    </Link>
  );
}