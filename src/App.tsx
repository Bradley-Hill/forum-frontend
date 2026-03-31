import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import Categories from "./routes/Categories.tsx";
import Login from "./routes/Login.tsx";
import Logout from "./routes/Logout.tsx";
import Threads from "./routes/Threads.tsx";
import Posts from "./routes/Posts.tsx";
import Profile from "./routes/Profile.tsx";
import Admin from "./routes/Admin.tsx";
import UserProfile from "./routes/UserProfile.tsx";
import Unauthorized from "./routes/Unauthorized.tsx";
import NotFound from "./routes/NotFound.tsx";
import Layout from "./components/Layout/Layout.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Categories />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/threads/:categorySlug" element={<Threads />} />
            <Route path="/post/:threadId" element={<Posts />} />
            <Route path="/users/:username" element={<UserProfile />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Admin />
                </ProtectedRoute>
              }
            />
            {/* Add more routes as needed */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
