import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Team from "./pages/Team";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import AdminNews from "./pages/AdminNews";
import AdminClubs from "./pages/AdminClubs";
import News from "./pages/News";
import NewsArticle from "./pages/NewsArticle";
import AdminGallery from "./pages/AdminGallery";
import Gallery from "./pages/Gallery";
import ClubRegistration from "./pages/ClubRegistration";
import Clubs from "./pages/Clubs";
import ClubDetails from "./pages/ClubDetails";
import ClubEdit from "./pages/ClubEdit";
import Contact from "./pages/Contact";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/echipa" element={<Team />} />
        <Route path="/stiri" element={<News />} />
        <Route path="/stiri/:id" element={<NewsArticle />} />
        <Route path="/galerie" element={<Gallery />} />
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<Admin />} />
        <Route path="/admin/news" element={<AdminNews />} />
        <Route path="/admin/gallery" element={<AdminGallery />} />
        <Route path="/admin/clubs" element={<AdminClubs />} />
        <Route path="/cluburi" element={<Clubs />} />
        <Route path="/cluburi/inscriere" element={<ClubRegistration/>} />
        <Route path="/cluburi/:id" element={<ClubDetails />} />
        <Route path="/cluburi/:id/propune-modificari" element={<ClubEdit />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;