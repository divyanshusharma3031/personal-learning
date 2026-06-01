import { Link } from "react-router-dom";
import type { BlogPost } from "../types/blog";
import { formatDate } from "../utils/formatDate";

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({
  post,
}: BlogCardProps) {
  return (
    <Link
      to={`/notes/${post.category}/${post.slug}`}
      className="
        group
        block
        rounded-xl
        border
        border-zinc-800
        bg-zinc-900/30
        p-5
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-zinc-600
        hover:bg-zinc-900/60
      "
    >
      <span
        className="
          rounded-full
          border
          border-zinc-700
          px-2
          py-1
          text-xs
          uppercase
          tracking-wide
          text-zinc-400
        "
      >
        {post.category}
      </span>

      <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
        <span>{formatDate(post.date)}</span>
      </div>

      <h3
        className="
          mt-2
          text-lg
          font-semibold
          transition-colors
          group-hover:text-white
        "
      >
        {post.title}
      </h3>

      <p className="mt-2 line-clamp-3 text-zinc-400">
        {post.summary}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {post.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="
              rounded-full
              bg-zinc-800
              px-2
              py-1
              text-xs
              text-zinc-400
            "
          >
            #{tag}
          </span>
        ))}
      </div>
    </Link>
  );
}