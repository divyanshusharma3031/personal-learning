import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import BlogCard from "../components/BlogCard";
import { getAllPosts } from "../lib/blog";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export default function Notes() {
  const posts = getAllPosts();
  const [search, setSearch] = useState("");

  const filteredPosts = useMemo(() => {
    return posts.filter((post) =>
      (
        post.title +
        " " +
        post.summary +
        " " +
        post.tags.join(" ")
      )
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [posts, search]);

  return (
    <>
      <section className="mb-12">
        <h1 className="text-5xl font-bold tracking-tight">
          Notes
        </h1>

        <p className="mt-4 max-w-2xl text-lg text-zinc-400">
          A collection of technical notes,
          learnings, experiments and lessons
          from backend engineering, cloud
          infrastructure, distributed systems
          and competitive programming.
        </p>
      </section>

      <section className="mb-10">
        <div className="relative">
          <input
            type="text"
            placeholder="Search notes, tags, topics..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="
              w-full
              rounded-xl
              border
              border-zinc-800
              bg-zinc-900/50
              px-5
              py-4
              text-zinc-200
              placeholder:text-zinc-500
              outline-none
              transition
              focus:border-zinc-600
            "
          />
        </div>

        <p className="mt-3 text-sm text-zinc-500">
          {filteredPosts.length} notes found
        </p>
      </section>

      {filteredPosts.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 p-8 text-center">
          <p className="text-zinc-400">
            No notes found.
          </p>
        </div>
      ) : (
        <motion.div
          className="grid gap-5 md:grid-cols-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredPosts.map((post) => (
            <motion.div
              key={post.slug}
              variants={itemVariants}
              transition={{
                duration: 0.4,
              }}
            >
              <BlogCard post={post} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </>
  );
}