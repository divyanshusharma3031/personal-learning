import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar />

      <main className="mx-auto max-w-5xl px-6 py-12">
        <Outlet />
      </main>
    </div>
  );
}