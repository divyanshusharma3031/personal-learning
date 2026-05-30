// src/utils/blog.ts

import fm from "front-matter";
import type { BlogPost } from "../types/blog";

function getSlugAndCategory(path: string) {
  const parts = path.split("/");

  const fileName = parts[parts.length - 1];
  const category = parts[parts.length - 2];

  const slug = fileName.replace(".md", "");

  return {
    slug,
    category,
  };
}
interface FrontmatterAttributes {
  title: string;
  date: string;
  category: string;
  summary: string;
  tags: string[];
}
export function getAllPosts(): BlogPost[] {
  const markdownFiles = import.meta.glob(
    "/content/**/*.md",
    {
      eager: true,
      query: "?raw",
      import: "default",
    }
  );

  const posts = Object.entries(markdownFiles).map(
    ([path, raw]) => {
      const { slug, category } =
        getSlugAndCategory(path);

      const parsed =
        fm<FrontmatterAttributes>(
          raw as string
        );

      return {
        slug,
        category,

        title:
          parsed.attributes.title,

        summary:
          parsed.attributes.summary,

        date:
          parsed.attributes.date,

        tags:
          parsed.attributes.tags || [],

        content:
          parsed.body,
      };
    }
  );

  return posts.sort(
    (a, b) =>
      new Date(b.date).getTime() -
      new Date(a.date).getTime()
  );
}
export function getPostBySlug(
  category: string,
  slug: string
): BlogPost | undefined {
  const posts = getAllPosts();

  return posts.find(
    (post) =>
      post.category === category &&
      post.slug === slug
  );
}