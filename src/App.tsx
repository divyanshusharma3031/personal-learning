import {
  HashRouter,
  Routes,
  Route,
} from "react-router-dom";
import MainLayout from "./layout/MainLayout"

import Home from "./pages/Home";
import Notes from "./pages/Notes";
import Timeline from "./pages/Timeline";
import About from "./pages/About";
import Post from "./pages/Post";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />

          <Route
            path="/notes"
            element={<Notes />}
          />
          <Route
            path="/notes/:category/:slug"
            element={<Post />}
          />
          <Route
            path="/timeline"
            element={<Timeline />}
          />

          <Route
            path="/about"
            element={<About />}
          />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;