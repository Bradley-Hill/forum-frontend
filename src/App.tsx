import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Layout/Header.tsx";
import Footer from "./components/Layout/Footer.tsx";
import Home from "./routes/Home.tsx";
import Login from "./routes/Login.tsx";
import Register from "./routes/Register.tsx";
import NotFound from "./routes/NotFound.tsx";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Add more routes as needed */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
