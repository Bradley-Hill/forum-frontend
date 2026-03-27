import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import Home from "./routes/Home.tsx";
import Login from "./routes/Login.tsx";
import Categories from "./routes/Categories.tsx";
import Threads from "./routes/Threads.tsx";
import Posts from "./routes/Posts.tsx";
import NotFound from "./routes/NotFound.tsx";
import Layout from "./components/Layout/Layout.tsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/threads/:categorySlug" element={<Threads />} />
            <Route path="/post/:threadId" element={<Posts />} />
            {/* Add more routes as needed */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
