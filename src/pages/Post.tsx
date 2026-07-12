import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";

import { getPostBySlug } from "../lib/blog";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { getReadingTime } from "../utils/getReadingTime";
import { formatDate } from "../utils/formatDate";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
export default function Post() {
    const { category, slug } = useParams();

    const post = getPostBySlug(
        category!,
        slug!
    );
    console.log(post);
    if (!post) {
        return (
            <div>
                Post not found
            </div>
        );
    }

    return (
        <article className="prose prose-invert max-w-none">
            <header className="mb-10 border-b border-zinc-800 pb-6">
                <h1 className="text-4xl font-bold tracking-tight">
                    {post.title}
                </h1>

                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-zinc-400">
                    <span>
                        📅 {formatDate(post.date)}
                    </span>

                    <span className="text-zinc-600">
                        •
                    </span>

                    <span>
                        ⏱️ {getReadingTime(post.content)} min read
                    </span>

                    <span className="text-zinc-600">
                        •
                    </span>

                    <span className="capitalize">
                        📂 {post.category}
                    </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                        <span
                            key={tag}
                            className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-300"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            </header>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight,rehypeSlug,rehypeAutolinkHeadings]}
            >
                {post.content}
            </ReactMarkdown>
        </article>
    );
}