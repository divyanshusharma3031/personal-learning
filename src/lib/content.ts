import matter from "gray-matter";

export function parseMarkdown(
  rawContent: string
) {
  const { data, content } =
    matter(rawContent);

  return {
    metadata: data,
    content,
  };
}