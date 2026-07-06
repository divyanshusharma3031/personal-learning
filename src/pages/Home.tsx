import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import BlogCard from "../components/BlogCard";
import { getAllPosts } from "../lib/blog";

export default function Home() {
  const posts = getAllPosts()
    .sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
    )
    .slice(0, 4);
  return (
    <>
      <motion.section
        className="space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          ease: "easeOut",
        }}
      >
        <p className="text-zinc-400">
          Backend Engineer @ SLB · Competitive Programmer
        </p>

        <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
          Divyanshu Katyan
        </h1>

        <p className="max-w-2xl text-lg leading-relaxed text-zinc-300">
          Documenting my journey through cloud
          infrastructure, distributed systems,
          backend engineering, system design and
          competitive programming.
        </p>

        <div className="flex gap-4 pt-2">
          <Link
            to="/notes"
            className="
              rounded-lg
              bg-white
              px-3
              py-3
              font-medium
              text-black
              transition
              hover:opacity-90
            "
          >
            Read Notes
          </Link>

          <Link
            to="/about"
            className="
              rounded-lg
              border
              border-zinc-700
              px-3
              py-3
              transition
              hover:border-zinc-500
            "
          >
            About
          </Link>
        </div>
      </motion.section>

      <section className="mt-16">
        <h2 className="mb-4 text-xl font-semibold">
          Current Focus
        </h2>

        <div className="flex flex-wrap gap-3">
          <span className="rounded-full border border-zinc-700 px-4 py-2">
            Candidate Master
          </span>

          <span className="rounded-full border border-zinc-700 px-4 py-2">
            Distributed Systems
          </span>

          <span className="rounded-full border border-zinc-700 px-4 py-2">
            Kubernetes
          </span>

          <span className="rounded-full border border-zinc-700 px-4 py-2">
            System Design
          </span>
        </div>
      </section>

      <section className="mt-20">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            Latest Notes
          </h2>

          <Link
            to="/notes"
            className="
              text-sm
              text-zinc-400
              transition
              hover:text-white
            "
          >
            View all →
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {posts.map((post, index) => (
            <motion.div
              key={post.slug}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.4,
                delay: index * 0.1,
              }}
            >
              <BlogCard post={post} />
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}