import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <header className="border-b border-zinc-800">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
                <h1 className="font-bold">
                    <Link to="/">
                        Divyanshu.dev
                    </Link>

                </h1>

                <nav className="flex gap-6">
                    <Link to="/notes">
                        Notes
                    </Link>
                    <a href="#">Timeline</a>
                    <a href="#">About</a>
                </nav>
            </div>
        </header>
    );
}