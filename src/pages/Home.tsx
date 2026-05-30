import { getAllPosts } from "../lib/blog";

export default function Home() {
  const posts = getAllPosts();
  console.log(posts);
  return (
    <>
      <section className="space-y-4">
        <p className="text-zinc-400">
          Backend Engineer @ SLB · Competitive Programmer
        </p>

        <h1 className="text-5xl font-bold">
          Divyanshu Katyan
        </h1>

        <p className="max-w-2xl text-lg text-zinc-300">
          Documenting what I learn about cloud
          infrastructure, distributed systems,
          backend engineering and competitive
          programming.
        </p>
      </section>

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
        <h2 className="mb-6 text-xl font-semibold">
          Latest Notes
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          {posts.map((post) => (
            <div
              key={post.slug}
              className="rounded-xl border border-zinc-800 p-5"
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
            </div>
          ))}
        </div>
      </section>
    </>
  );
}